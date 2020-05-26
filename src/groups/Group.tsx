// Group.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import {
  DEFAULT_NORMAL_VEC3,
  DEFAULT_NORMAL,
  EULER_ORDERS
} from "../utils/constants";
import { ViewContext } from "../views/ViewContext";
import { EPS } from "../utils/math";
import {
  handleClick,
  checkPropagation,
  AnimationComponent
} from "../utils/events";
import { GeometryPropTypes } from "../utils/interfaces";
import { toQuaternion } from "../utils/util";

const {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
  memo,
  forwardRef
} = React;

export interface GroupProps {
  position?: Array<number>;
  scale?: Array<number>;
  rotation?: Array<number>;
  eulerOrder?: string;
  normal?: Array<number>;
  roll?: number;
  up?: Array<number>;
  quaternion?: Array<number> | THREE.Quaternion;
  // Material
  materialType?: string;
  edges?: boolean;
  edgeColor?: string;
  edgeThresholdAngle?: number;
  view3DEnvMap?: boolean;
  // Material Props
  color?: string | THREE.Color;
  hoverColor?: string;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  visible?: boolean;
  side?: string | THREE.Side;
  // ShadowProps
  castShadow?: boolean;
  receiveShadow?: boolean;
  // Group Props
  groupMember?: boolean;
  // Animation Function
  animation?: Function;
  // State
  state?: object;
  // Ref
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ref?: React.Ref<any>;
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
  // Children
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children?: any;
}

/**
 * Group
 *
 * In Standard View, Group is a wrapper of react-three-fiber/three.js's group.
 * This component allows composing children components into one large
 * manipulatable mesh-like component. This is useful for creating 3D assets
 * comprised of many pieces and then perform transformations and animations
 * on the whole asset.
 *
 * Group will extract away the group properties for the group manipulations
 * at a group level.
 */
const Group: React.FunctionComponent<GroupProps> = forwardRef<
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  React.RefObject<any>,
  GroupProps
>(function Group(
  {
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    eulerOrder = EULER_ORDERS.XYZ,
    roll = 0,
    quaternion,
    normal = DEFAULT_NORMAL,
    // Material Props
    materialType,
    view3DEnvMap,
    // materialProps
    color,
    hoverColor,
    opacity,
    transparent,
    wireframe,
    edges,
    edgeColor,
    edgeThresholdAngle,
    side,
    // Group Props
    groupMember = false,
    // Shadow Props
    castShadow,
    receiveShadow,
    // Animation Function
    animation,
    // State
    state,
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
    children,
    ...otherProps
  },
  ref
) {
  // Canvas Properties
  const canvasProps = useContext(ViewContext);

  // Rotation
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
        // @ts-ignore:T2345 // spread
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

        // @ts-ignore:T2345 // spread
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

  // Ref
  const groupRef = useRef(); // Hooks must be deterministic
  const group = ref || groupRef;

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
        mesh: group,
        group,
        state: _state,
        setState,
        ...canvasProps
      };
    },
    [group, _state, setState, canvasProps]
  );

  // Click Props
  const clickProps = useMemo(
    function updateClickProps() {
      return {
        mousePropagation,
        clickSensitivity,
        group,
        eventProps,
        onClick,
        onDoubleClick
      };
    },
    [
      mousePropagation,
      clickSensitivity,
      group,
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
          onPointerOver(eventProps);
        }
      }
    },
    [onPointerOver, hoverColor, hoverable, eventProps, mousePropagation]
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
          onPointerOut(eventProps);
        }
      }
    },
    [onPointerOut, color, hoverColor, hoverable, eventProps, mousePropagation]
  );

  // onPointerDown
  const _onPointerDown = useCallback(
    function onMouseDown(e) {
      // Mouse Propagation
      checkPropagation(e, mousePropagation);

      if (onPointerDown) {
        onPointerDown(eventProps);
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
        onPointerUp(eventProps);
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
        onPointerMove(eventProps);
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
        onWheel(eventProps);
      }
    },
    [onWheel, mousePropagation, eventProps]
  );

  // onClick + onDoubleClick
  const _onClick = useCallback(handleClick(clickProps), [clickProps]);

  // ------------------------- //
  // -----   Animation   ----- //
  // ------------------------- //
  // Animation Function
  const _animation = useCallback(
    function onAnimation() {
      // @ts-ignore:TS2339 current does not exist for group
      if (animation && group.current) {
        animation(eventProps);
      }
    },
    [group, animation, eventProps]
  );

  // Child Props
  const childProps = useMemo(
    function updateChildProps() {
      const props = { groupMember: true };

      const potentialChildProps = {
        color: _color,
        view3DEnvMap,
        materialType,
        transparent,
        opacity,
        side,
        wireframe,
        castShadow,
        receiveShadow,
        edges,
        edgeColor,
        edgeThresholdAngle
      };

      Object.entries(potentialChildProps).map(([key, value]) => {
        if (value != null) {
          // check != null to catch 0
          props[key] = value;
        }
        return null;
      });

      return props;
    },
    [
      _color,
      view3DEnvMap,
      materialType,
      side,
      transparent,
      opacity,
      castShadow,
      receiveShadow,
      wireframe,
      edges,
      edgeColor,
      edgeThresholdAngle
    ]
  );

  return (
    // @ts-ignore:TS2322
    <group
      ref={group}
      // Geometry
      position={position as [number, number, number]}
      scale={_scale as [number, number, number]}
      quaternion={_quaternion}
      // Event Functions
      onPointerOver={_ignoreMouseEvents ? undefined : _onPointerOver}
      onPointerOut={_ignoreMouseEvents ? undefined : _onPointerOut}
      onPointerDown={_ignoreMouseEvents ? undefined : _onPointerDown}
      onPointerUp={_ignoreMouseEvents ? undefined : _onPointerUp}
      onPointerMove={_ignoreMouseEvents ? undefined : _onPointerMove}
      onWheel={_ignoreMouseEvents ? undefined : _onWheel}
      onClick={_ignoreMouseEvents ? undefined : _onClick}
      {...otherProps}
    >
      {animation && <AnimationComponent animation={_animation} />}
      {children &&
        React.Children.map(children, child => {
          if (!child) {
            return null;
          }

          return React.cloneElement(child, childProps);
        })}
      {/*
      // @ts-ignore:TS2322 */}
    </group>
  );
});

// -----  PropTypes   ----- //
/* eslint-disable react/forbid-prop-types */
Group.propTypes = exact({
  // Geometry
  ...GeometryPropTypes,
  // Material
  view3DEnvMap: PropTypes.bool,
  materialType: PropTypes.string,
  // materialProps
  visible: PropTypes.bool,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  hoverColor: PropTypes.string,
  opacity: PropTypes.number,
  transparent: PropTypes.bool,
  wireframe: PropTypes.bool,
  side: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Shadow
  castShadow: PropTypes.bool,
  receiveShadow: PropTypes.bool,
  // Group
  groupMember: PropTypes.bool,
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
  // Children
  children: PropTypes.any
});
/* eslint-enable react/forbid-prop-types */

/* eslint-disable-next-line react/forbid-foreign-prop-types */
export const GroupPropTypes = Group.propTypes;

const GroupMemo = memo(Group);
GroupMemo.displayName = "Group";
export default GroupMemo;

/**
 * Generate Group Props
 *
 * For shapes composed of multiple primitives, like the Capsule,
 * the meshes are grouped together. In order to rotate, scale,
 * translate, and animate the entire group rather than each individual primitive,
 * the group properties are extracted out and nulled for the primitives.
 *
 * Other properties, such as material related properties are passed down
 * so the appearance of the group is uniform.
 *
 * @param {any} props
 * @returns {GroupProps}
 */
export function generateGroupProps(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  props: any
): { cleanedProps: any; groupProps: any } {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const {
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    quaternion,
    animation,
    state,
    onClick,
    onDoubleClick,
    onWheel,
    onPointerUp,
    onPointerDown,
    onPointerMove,
    onPointerOver,
    onPointerOut,
    mousePropagation,
    clickSensitivity,
    ignoreMouseEvents,
    ...cleanedProps
  } = props;

  const groupProps = {
    position,
    scale,
    rotation,
    normal,
    roll,
    quaternion,
    animation,
    state,
    onClick,
    onDoubleClick,
    onWheel,
    onPointerUp,
    onPointerDown,
    onPointerMove,
    onPointerOver,
    onPointerOut,
    mousePropagation,
    clickSensitivity,
    ignoreMouseEvents
  };

  return { cleanedProps, groupProps };
}
