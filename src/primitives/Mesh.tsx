// Mesh.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { DEFAULT_COLOR } from "../utils/styles";
import {
  DEFAULT_NORMAL,
  DEFAULT_NORMAL_VEC3,
  MATERIAL_TYPES,
  SIDE_TYPES,
  EULER_ORDERS
} from "../utils/constants";
import { StandardViewTypes, GeometryPropTypes } from "../utils/interfaces";
import { EPS } from "../utils/math";
import {
  handleClick,
  checkPropagation,
  AnimationComponent
} from "../utils/events";
import { useViewContext } from "../utils/hooks";
import { objectToArray, filterArrayLength, toQuaternion } from "../utils/util";
import { performanceStart, performanceEnd } from "../utils/performance";

const {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  memo
} = React;

export interface MeshProps {
  // Mesh Props
  position?: Array<number>;
  scale?: Array<number>;
  geometry?: StandardViewTypes.Geometries;
  // Rotation Props
  rotation?: Array<number>;
  eulerOrder?: string;
  normal?: Array<number>;
  up?: Array<number>;
  roll?: number;
  quaternion?: Array<number> | THREE.Quaternion;
  // Material Props
  materialType?: string;
  material?: THREE.Material;
  view3DEnvMap?: boolean;
  // materialProps
  color?: string | THREE.Color;
  hoverColor?: string;
  opacity?: number;
  transparent?: boolean;
  roughness?: number;
  metalness?: number;
  reflectivity?: number;
  anisotropy?: number;
  texturePath?: string;
  textureURL?: string;
  map?: THREE.Texture;
  aoMap?: THREE.Texture;
  aoMapIntensity?: number;
  bumpMap?: THREE.Texture;
  bumpScale?: number;
  normalMap?: THREE.Texture;
  normalMapType?: number;
  normalMapScale?: number;
  displacementMap?: THREE.Texture;
  displacementMapScale?: number;
  displacementBias?: number;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  alphaMap?: THREE.Texture;
  envMap?: THREE.Texture;
  envMapIntensity?: number;
  wireframe?: boolean;
  side?: string | THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  renderOrder?: number;
  visible?: boolean;
  // Group Props
  groupMember?: boolean;
  // Shadow Props
  castShadow?: boolean;
  receiveShadow?: boolean;
  // Animation Function
  animation?: Function;
  // Ref
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ref?: React.Ref<any>;
  // State
  state?: object;
  // Event Functions
  onClick?: Function;
  onDoubleClick?: Function;
  onWheel?: Function;
  onPointerUp?: Function;
  onPointerDown?: Function;
  onPointerOver?: Function;
  onPointerOut?: Function;
  onPointerMove?: Function;
  // Event Props
  hoverable?: boolean;
  mousePropagation?: boolean;
  clickSensitivity?: number; // milliseconds
  ignoreMouseEvents?: boolean;
  // Analysis Props
  track?: boolean;
  frame?: number;
  // Children
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children?: any;
}

interface MaterialComponentProps {
  materialType: string;
  hasMaterialChild: boolean;
  material: THREE.Material;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  materialProps: any; // Object
}

/**
 * Material Component
 *
 * Creates custom material based on materialType and material props
 * if no material child exists.
 */
const MaterialComponent = memo<MaterialComponentProps>(
  /* eslint-disable react/prop-types */
  function MaterialComponent({
    materialType,
    material,
    hasMaterialChild,
    materialProps
  }) {
    const MeshMaterial = useMemo(
      function updateMeshMaterial() {
        // Validated materialType
        if (!MATERIAL_TYPES[materialType]) {
          return MATERIAL_TYPES.basic;
        }

        return MATERIAL_TYPES[materialType];
      },
      [materialType]
    );

    if (hasMaterialChild || material) {
      return null;
    } else {
      return <MeshMaterial attach="material" args={[materialProps]} />;
    }
  }
  /* eslint-enable react/prop-types */
);
MaterialComponent.displayName = "MaterialComponent";

/**
 * Mesh
 *
 * This is a wrapper for react-three-fiber/three.js's mesh.
 * In three.js Mesh extends Object3D which is essentially the root of
 * all 3D objects. With this wrapper, Standard View users need not
 * get tangled with the intricacies of geometries and materials and
 * may treat primitives as singular objects with properties. Standard View
 * manages which property is assigned to geometry or materials.
 * However, just as react-three-fiber allows for manipulation of all the
 * three.js properties, so does Standard View. A primitive or shape may be
 * loaded with custom geometry or materials or even composed with custom
 * child components.
 *
 * In Standard View, nearly all the primitives are composed within Mesh.
 * The common properties of all Meshes are applied in this component.
 *
 * Mesh has two important child components: material and geometry.
 * These components may also be passed as material and geometry props.
 * The type of geometry and material depend on the primitive.
 * The geometry must be passed in either as a property or composed
 * within the component as a child.
 *
 * If no material is passed in, a default meshBasicMaterial is created.
 * The properties that Mesh accepts include those defined in the
 * MeshProps type (and also anything that three.js Mesh has a setter for)
 *
 * Note that most geometry are initialized with unit lengths and parameters,
 * and it is actually the mesh that is scaled, rotated, translated to get
 * the particular shape and orientation desired. Fortunately, all parameters
 * passed into the Prefab primitives will be drilled down to Mesh and applied.
 *
 * Mesh can also support animations via the animation property. A function with
 * one argument that may be destructured to include mesh, state, setState, and any
 * Canvas props desired for the animation.
 * All primitives and shapes may have animation. These animations are reactive,
 * infinite requestAnimationFrame loops, so they incur many render calls,
 * but also maintain react-three-renderer's native raycasting for the
 * event property functions, onPointerHover, onPointerOut, onPointerClick,
 * onPointerMove, onPointerDown, onPointerUp, onWheel,
 * and other mouse-handling events.
 *
 * Mesh also exposes react-three-fiber's the event property functions but with
 * a constrained argument set, same as animation. All event property functions
 * take one arguement that may be destructured to include mesh, state, setState,
 * and any Canvas prop. The benefit of this design, just like
 * animations, is that a reference to mesh is automatically provided and also
 * access to all props are available. Moreover, react-three-fiber's Canvas
 * state properties are exposed. This allows event functions to reach right
 * into the react-three-fiber/three.js's scene, camera, gl. Hence all shapes
 * that are Meshes may have these event property functions.
 *
 * @param {MeshProps} props
 */

const Mesh: React.FunctionComponent<MeshProps> = forwardRef<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  React.RefObject<any>,
  MeshProps
>(function Mesh(
  {
    // Geometry Props
    geometry,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    // Rotation Props (passed into quaternion)
    rotation = [0, 0, 0],
    eulerOrder = EULER_ORDERS.XYZ,
    normal = DEFAULT_NORMAL,
    roll = 0,
    quaternion,
    // Material Props
    material,
    materialType = "basic",
    color = DEFAULT_COLOR,
    hoverColor,
    opacity = 1,
    transparent,
    roughness = 0.5,
    metalness = 0.5,
    reflectivity = 0.5,
    texturePath,
    textureURL,
    map,
    aoMap,
    aoMapIntensity,
    bumpMap,
    bumpScale,
    normalMap,
    normalMapType,
    normalMapScale,
    displacementMap,
    displacementMapScale,
    displacementBias,
    roughnessMap,
    metalnessMap,
    alphaMap,
    envMap,
    envMapIntensity,
    view3DEnvMap = false,
    wireframe = false,
    // edges = false,
    // edgeColor = "black",
    // edgeThresholdAngle = 1,
    side = "front",
    depthWrite = true,
    depthTest = true,
    // Map Props
    anisotropy = 1,
    // Group Props
    groupMember = false,
    // Event Functions
    onClick,
    onDoubleClick,
    onWheel,
    onPointerUp,
    onPointerDown,
    onPointerOver,
    onPointerOut,
    onPointerMove,
    // Event Props
    hoverable = true,
    mousePropagation = false,
    clickSensitivity = 250,
    ignoreMouseEvents = false,
    // Shadow Props
    // castShadow
    receiveShadow, // Need to manually update needsUpdate
    // Animation Function
    animation,
    // State
    state,
    // Analysis Props
    // track = false,
    // frame = 0,
    // Children
    children,
    // Mesh Props (passed into otherProps)
    ...otherProps
  },
  ref
) {
  performanceStart("Mesh");

  // Canvas Properties
  // const canvasProps = useContext(ViewContext);
  const { envMap: viewContextEnvMap, ...canvasProps } = useViewContext();

  // Position
  const _position = useMemo(
    function updatePosition() {
      if (position) {
        return filterArrayLength(objectToArray(position), 3, [0, 0, 0]);
      }
      return undefined;
    },
    [position]
  );

  // Rotations
  // Intuitively, the component is aligned to the given normal in world space.
  // Then, it is rotated by the rotation / quaternion in the component's local space.
  // Then, it is rotated by the  roll about the normal in the component's local space.
  // Since all quaternions are applied in world space, the rotations must all occur in reverse order.
  // So, first apply the roll about the DEFAULT_NORMAL, then rotate by the rotation / quaternion,
  // then apply the normal. This is equivalent to doing local rotations in the intuitive order.
  // Hence q = normalQ * rotationQ * rollQ
  const _quaternion = useMemo(
    function updateQuaternion() {
      // Normal
      // @ts-ignore:T2345 // spread
      const normalVec = new THREE.Vector3(...normal).normalize();
      const normalQ = new THREE.Quaternion().setFromUnitVectors(
        DEFAULT_NORMAL_VEC3,
        normalVec
      );

      // Rotation / Quaternion
      let rotationQ = new THREE.Quaternion();
      if (quaternion == null) {
        // Convert Euler Rotation to Quaternion
        // @ts-ignore:T2345
        let _eulerOrder = eulerOrder.toUpperCase();
        _eulerOrder = EULER_ORDERS[_eulerOrder]
          ? _eulerOrder
          : EULER_ORDERS.XYZ;
        const euler = new THREE.Euler(...rotation, _eulerOrder);
        rotationQ = new THREE.Quaternion().setFromEuler(euler);
      } else {
        rotationQ = toQuaternion(quaternion);
      }

      // Roll
      const rollQ = new THREE.Quaternion().setFromAxisAngle(
        DEFAULT_NORMAL_VEC3,
        roll
      );

      // q = normalQ * rotationQ * rollQ
      const q = new THREE.Quaternion(); // Identity
      q.premultiply(rollQ);
      q.premultiply(rotationQ);
      q.premultiply(normalQ);
      return q;
    },
    [quaternion, rotation, eulerOrder, normal, roll]
  );

  // Scale
  const _scale = useMemo(
    function updateScale() {
      // Invalid Scale  Warning
      if (!Array.isArray(scale) || scale.length !== 3) {
        /* eslint-disable-next-line no-console */
        console.warn(
          `[Mesh] scale must be a 3x1 array of numbers! scale: ${scale}`
        );
        return [1, 1, 1];
      }

      // Handle Zero Scale Input
      if (
        !scale[0] ||
        !scale[1] ||
        !scale[2] ||
        Math.abs(scale[0]) < EPS ||
        Math.abs(scale[1]) < EPS ||
        Math.abs(scale[2]) < EPS
      ) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Mesh] scale elements must be non-zero! scale: ${scale}`);

        return scale.map(value => Math.max(value, EPS));
      }

      return scale;
    },
    [scale]
  );

  // Color
  const [_color, setColor] = useState(color);
  useEffect(
    function updateColor() {
      setColor(color);
    },
    [color]
  );

  // Map Props
  const mapProps = useMemo(
    function initMapProps() {
      return {
        anisotropy
      };
    },
    [anisotropy]
  );

  // TextureURL
  const _textureURL = useMemo(
    function updateTextureURL() {
      return texturePath ? texturePath + textureURL : textureURL;
    },
    [texturePath, textureURL]
  );

  // Load Texture
  const _map = useMemo(
    function updateMap() {
      if (_textureURL) {
        // Create Texture
        const tex = new THREE.TextureLoader().load(_textureURL);
        // Set Map Props
        Object.entries(mapProps).map(([prop, value]) => {
          tex[prop] = value;
          return null;
        });
        return tex;
      }

      return map;
    },
    [map, mapProps, _textureURL]
  );

  // Environment Map
  const _envMap = useMemo(
    function updateEnvMap() {
      const compatibleMaterials = ["basic", "physical", "standard"];
      return view3DEnvMap && compatibleMaterials.includes(materialType)
        ? viewContextEnvMap
        : envMap;
    },
    [viewContextEnvMap, view3DEnvMap, envMap, materialType]
  );

  // Other Maps
  const otherMaps = useMemo(
    function initOtherMap() {
      const otherMapProps = {
        aoMap,
        aoMapIntensity,
        bumpMap,
        bumpScale,
        normalMap,
        normalMapType,
        normalMapScale,
        displacementMap,
        displacementMapScale,
        displacementBias,
        roughnessMap,
        metalnessMap,
        alphaMap,
        envMap: _envMap,
        envMapIntensity
      };

      return otherMapProps;
    },
    [
      aoMap,
      aoMapIntensity,
      bumpMap,
      bumpScale,
      normalMap,
      normalMapType,
      normalMapScale,
      displacementMap,
      displacementMapScale,
      displacementBias,
      roughnessMap,
      metalnessMap,
      alphaMap,
      _envMap,
      envMapIntensity
    ]
  );

  // Side
  const _side = useMemo(
    function updateSide() {
      if (typeof side === "string") {
        return SIDE_TYPES[side];
      } else {
        // THREE.Side
        return side;
      }
    },
    [side]
  );

  // Material Props
  const materialProps = useMemo(
    function updateMaterialProps() {
      // Metalness
      const _metalness =
        materialType === "standard" || materialType === "physical"
          ? metalness
          : undefined;
      // Roughness
      const _roughness =
        materialType === "standard" || materialType === "physical"
          ? roughness
          : undefined;
      // Reflectivity
      const reflectiveMaterials = ["basic", "lambert", "phong", "physical"];
      const _reflectivity = reflectiveMaterials.includes(materialType)
        ? reflectivity
        : undefined;
      // Collect All Material Props
      const allMaterialProps = {
        color: _color,
        map: _map,
        ...otherMaps,
        wireframe,
        opacity,
        transparent: transparent != null ? transparent : opacity < 1 - EPS,
        roughness: _roughness,
        metalness: _metalness,
        reflectivity: _reflectivity,
        side: _side,
        depthWrite,
        depthTest
      };

      // Clean undefined and null
      const cleanedMaterialProps = {};
      Object.entries(allMaterialProps).map(([key, value]) => {
        if (value != null) {
          cleanedMaterialProps[key] = value;
        }
        return null;
      });

      return cleanedMaterialProps;
    },
    [
      materialType,
      metalness,
      roughness,
      reflectivity,
      _color,
      _map,
      otherMaps,
      wireframe,
      opacity,
      transparent,
      _side,
      depthWrite,
      depthTest
    ]
  );

  // Children
  const _children = useMemo(
    function updateChildren() {
      return children || null;
    },
    [children]
  );

  // Check Children for Material
  // Only checks on load. If material children are add later,
  // will not rerender.
  const hasMaterialChild = useMemo(
    function checkMaterialChild() {
      // No Children
      if (_children == null) {
        return false;
      }

      // Check Children
      if (_children.length == null) {
        // Check The Only Child for Material
        // Separate check necessary because when there is only one child,
        // react stores children as a variable instead of an array.
        if (Object.values(MATERIAL_TYPES).includes(_children.type)) {
          // Update props.color with child material's color
          if (_children.props.color) {
            setColor(_children.props.color);
          }

          return true;
        }
      } else {
        // Check Each Child for Material
        /* eslint-disable no-restricted-syntax */ // loop
        for (const child of _children) {
          if (
            child != null &&
            Object.values(MATERIAL_TYPES).includes(child.type)
          ) {
            // Update props.color with child material's color
            if (child.props.color) {
              setColor(child.props.color);
            }

            return true;
          }
        }
        /* eslint-enable no-restricted-syntax */
      }

      // No Material Children
      return false;
    },
    [_children]
  );

  // Material
  const _material = useMemo(
    function updateMaterial() {
      return material || null;
    },
    [material]
  );

  // Ref
  const meshRef = useRef(); // Hooks must be deterministic
  const mesh = ref || meshRef;

  // State
  const [_state, setState] = useState(
    state != null ? { lastClickTime: 0, ...state } : { lastClickTime: 0 }
  );

  // ignoreMouseEvents
  const _ignoreMouseEvents = useMemo(
    function updateIgnoreMouseEvents() {
      return (
        ignoreMouseEvents ||
        (groupMember &&
          !hoverColor &&
          !onClick &&
          !onDoubleClick &&
          !onPointerOver &&
          !onPointerOut &&
          !onPointerDown &&
          !onPointerUp &&
          !onPointerMove &&
          !onWheel)
      );
    },
    [
      ignoreMouseEvents,
      groupMember,
      hoverColor,
      onClick,
      onDoubleClick,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onPointerMove,
      onWheel
    ]
  );

  // ---------------------- //
  // -----   Events   ----- //
  // ---------------------- //
  // Event Props
  const eventProps = useMemo(
    function updateEventProps() {
      return {
        mesh,
        state: _state,
        setState,
        ...canvasProps
      };
    },
    [mesh, _state, setState, canvasProps]
  );

  // Click Props
  const clickProps = useMemo(
    function updateClickProps() {
      return {
        mousePropagation,
        clickSensitivity,
        mesh,
        eventProps,
        onClick,
        onDoubleClick
      };
    },
    [
      mousePropagation,
      clickSensitivity,
      mesh,
      eventProps,
      onClick,
      onDoubleClick
    ]
  );

  // onPointerOver
  const _onPointerOver = useCallback(
    function onHoverOver(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (hoverable) {
        if (hoverColor != null) {
          setColor(hoverColor);
        }
        if (onPointerOver) {
          onPointerOver({ ...e, ...eventProps });
        }
      }
    },
    [onPointerOver, hoverable, hoverColor, eventProps, mousePropagation]
  );

  // onPointerOut
  const _onPointerOut = useCallback(
    function onHoverOut(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (hoverable) {
        if (hoverColor != null) {
          setColor(color);
        }
        if (onPointerOut) {
          onPointerOut({ ...e, ...eventProps });
        }
      }
    },
    [onPointerOut, hoverable, hoverColor, color, eventProps, mousePropagation]
  );

  // onPointerDown
  const _onPointerDown = useCallback(
    function onMouseDown(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (onPointerDown) {
        onPointerDown({ ...e, ...eventProps });
      }
    },
    [onPointerDown, mousePropagation, eventProps]
  );

  // onPointerUp
  const _onPointerUp = useCallback(
    function onMouseUp(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (onPointerUp) {
        onPointerUp({ ...e, ...eventProps });
      }
    },
    [onPointerUp, mousePropagation, eventProps]
  );

  // onPointerMove
  const _onPointerMove = useCallback(
    function onMouseMove(e) {
      //  Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (onPointerMove) {
        onPointerMove({ ...e, ...eventProps });
      }
    },
    [onPointerMove, mousePropagation, eventProps]
  );

  // onWheel
  const _onWheel = useCallback(
    function onScroll(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (onWheel) {
        onWheel({ ...e, ...eventProps });
      }
    },
    [onWheel, mousePropagation, eventProps]
  );

  // onClick + onDoubleClick
  const _onClick = useCallback(handleClick(clickProps), [clickProps]);

  // ------------------------- //
  // -----   Animation   ----- //
  // ------------------------- //
  // Animatiom Function
  const _animation = useCallback(
    function onAnimation() {
      // @ts-ignore:TS2339 // current not in RefObject<any> | null
      if (animation && mesh.current) {
        animation(eventProps);
      }
    },
    [mesh, animation, eventProps]
  );

  // ----------------------- //
  // -----   Shadows   ----- //
  // ----------------------- //
  const _receiveShadow = useMemo(
    function updateReceiveShadow() {
      // @ts-ignore:TS2339 // current not in RefObject<any> | null
      if (mesh && mesh.current) {
        // @ts-ignore:TS2339 // current not in RefObject<any> | null
        mesh.current.material.needsUpdate = true;
      }

      return receiveShadow;
    },
    [receiveShadow, mesh]
  );

  performanceEnd("Mesh");

  return (
    <>
      {performanceStart("Around mesh")}
      <mesh
        ref={mesh}
        // Event Functions
        onPointerOver={_ignoreMouseEvents ? undefined : _onPointerOver}
        onPointerOut={_ignoreMouseEvents ? undefined : _onPointerOut}
        onPointerDown={_ignoreMouseEvents ? undefined : _onPointerDown}
        onPointerUp={_ignoreMouseEvents ? undefined : _onPointerUp}
        onPointerMove={_ignoreMouseEvents ? undefined : _onPointerMove}
        onWheel={_ignoreMouseEvents ? undefined : _onWheel}
        onClick={_ignoreMouseEvents ? undefined : _onClick}
        // Geometry
        geometry={geometry || undefined}
        position={_position as [number, number, number]}
        scale={_scale as [number, number, number]}
        quaternion={_quaternion}
        // @ts-ignore:TS2322 // conflict with Mesh from THREE
        material={_material}
        receiveShadow={_receiveShadow}
        {...otherProps}
      >
        <MaterialComponent
          materialType={materialType}
          hasMaterialChild={hasMaterialChild}
          // @ts-ignore:TS2322 // conflict with Mesh from THREE
          material={_material}
          materialProps={materialProps}
        />
        {animation && <AnimationComponent animation={_animation} />}
        {_children}
      </mesh>
      {performanceEnd("Around mesh")}
    </>
  );
});

// ------------------------- //
// -----   PropTypes   ----- //
// ------------------------- //
/* eslint-disable react/forbid-prop-types */
Mesh.propTypes = exact({
  // Geometry
  ...GeometryPropTypes,
  // Material
  material: PropTypes.object, // THREE.Material
  materialType: PropTypes.string,
  view3DEnvMap: PropTypes.bool,
  // materialProps
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  hoverColor: PropTypes.string,
  opacity: PropTypes.number,
  transparent: PropTypes.bool,
  roughness: PropTypes.number,
  metalness: PropTypes.number,
  reflectivity: PropTypes.number,
  anisotropy: PropTypes.number,
  texturePath: PropTypes.string,
  textureURL: PropTypes.string,
  map: PropTypes.object, // THREE.Texture,
  aoMap: PropTypes.object, // THREE.Texture
  aoMapIntensity: PropTypes.number,
  bumpMap: PropTypes.object, // THREE.Texture
  bumpScale: PropTypes.number,
  normalMap: PropTypes.object, // THREE.Texture
  normalMapType: PropTypes.number,
  normalMapScale: PropTypes.number,
  displacementMap: PropTypes.object, // THREE.Texture
  displacementMapScale: PropTypes.number,
  displacementBias: PropTypes.number,
  roughnessMap: PropTypes.object, // THREE.Texture
  metalnessMap: PropTypes.object, // THREE.Texture
  alphaMap: PropTypes.object, // THREE.Texture
  envMap: PropTypes.object, // THREE.Texture
  envMapIntensity: PropTypes.number,
  wireframe: PropTypes.bool,
  visible: PropTypes.bool,
  side: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  depthWrite: PropTypes.bool,
  depthTest: PropTypes.bool,
  renderOrder: PropTypes.number,

  // Group
  groupMember: PropTypes.bool,
  // Shadow
  castShadow: PropTypes.bool,
  receiveShadow: PropTypes.bool,
  // Animation
  animation: PropTypes.func,
  // State
  state: PropTypes.object,
  // Events
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onWheel: PropTypes.func,
  onPointerUp: PropTypes.func,
  onPointerDown: PropTypes.func,
  onPointerMove: PropTypes.func,
  onPointerOver: PropTypes.func,
  onPointerOut: PropTypes.func,
  hoverable: PropTypes.bool,
  mousePropagation: PropTypes.bool,
  clickSensitivity: PropTypes.number,
  ignoreMouseEvents: PropTypes.bool,
  // Track
  track: PropTypes.bool,
  frame: PropTypes.number,
  // Children
  children: PropTypes.any
});
/* eslint-enable react/forbid-prop-types */

/* eslint-disable-next-line react/forbid-foreign-prop-types */
export const MeshPropTypes = Mesh.propTypes;

const MeshMemo = memo(Mesh);
MeshMemo.displayName = "Mesh";
export default MeshMemo;
