// Camera.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Box from "../primitives/Box";
import Circle from "../primitives/Circle";
import Cylinder from "../primitives/Cylinder";
import Label from "../primitives/Label";
import Arrow from "./Arrow";
import Text from "../primitives/Text";
import { MeshProps, MeshPropTypes } from "../primitives/Mesh";
import Group from "./Group";
import {
  billboard,
  propTypeNumberArrayOfLength,
  toQuaternion,
  objectToArray
} from "../utils/util";
import { EPS } from "../utils/math";
import { useFrame } from "../utils/hooks";
import {
  DEFAULT_UP,
  DEFAULT_UP_VEC3,
  DEFAULT_NORMAL,
  DEFAULT_NORMAL_VEC3,
  EULER_ORDERS
} from "../utils/constants";

const { useMemo, memo } = React;

function updateAllOpacity({
  children,
  originalOpacity,
  newOpacity = 0.5,
  restore = false
}): void {
  // Validation
  if (!children) {
    return;
  }
  const _children = Array.isArray(children) ? children : [children];

  // Update Meshes
  _children
    .filter(child => child.constructor.name === "")
    .map(mesh => {
      /* eslint-disable no-param-reassign */
      if (restore) {
        // Restore
        mesh.material.opacity = originalOpacity.pop();
      } else {
        // Enable Transparency
        mesh.material.transparent = true;
        // Update Opacity
        const oldOpacity =
          mesh.material.opacity != null ? mesh.material.opacity : 1;
        originalOpacity.push(oldOpacity);
        mesh.material.opacity = newOpacity;
      }

      // Update Material
      mesh.material.needsUpdate = true;

      return null;
      /* eslint-enable no-param-reassign */
    });

  // Recurse into Groups
  _children
    .filter(child => child.constructor.name === "Group")
    .map(group =>
      updateAllOpacity({
        children: group.children,
        originalOpacity,
        newOpacity,
        restore
      })
    );

  // Recurse into Scenes
  _children
    .filter(child => child.constructor.name === "Scene")
    .map(scene =>
      updateAllOpacity({
        children: scene.children,
        originalOpacity,
        newOpacity,
        restore
      })
    );
}

/**
 * setAllOpacity
 *
 * Recursively call updateAllOpacity on groups and sets material opacity
 * and transparennt for all meshes
 * originalCapacity needs to be reverse since, restoreAllOpacity will
 * pop elements from originalCapacity in the same order in which they
 * were pushed to the array.
 */
function setAllOpacity(children, newOpacity): Function {
  let originalOpacity = [];
  updateAllOpacity({
    children,
    originalOpacity,
    newOpacity,
    restore: false
  });
  originalOpacity = originalOpacity.reverse();

  // restoreAllOpacity closure
  // Something screwy is happening in the restore
  return function restoreAllOpacity(): void {
    updateAllOpacity({
      children,
      originalOpacity,
      newOpacity,
      restore: true
    });
  };
}

function CullCoverage({ frustum, cull, coverageColor, coverageOpacity }): null {
  useFrame(function updateRenderLoop({ gl, scene, camera }) {
    /* eslint-disable no-param-reassign */
    if (!cull) {
      return;
    }

    // Prevent Render of Full Scene after Culling
    // @ts-ignore:TS2339 cancelTailRender does not exist on scene
    scene.cancelTailRender = true;

    // Original Color Coverage with Custom Coverage Opacity
    if (coverageColor == null && coverageOpacity < 1) {
      const restoreAllOpacity = setAllOpacity(scene.children, coverageOpacity);
      gl.clippingPlanes = frustum.planes;
      gl.render(scene, camera);

      // Restore WebGLRender Options
      restoreAllOpacity();
      scene.overrideMaterial = null;
      gl.clippingPlanes = [];
      return;
    }

    // Override Color
    if (coverageColor != null) {
      scene.overrideMaterial = new THREE.MeshBasicMaterial({
        color: coverageColor,
        transparent: true,
        opacity: coverageOpacity
      });
    }

    gl.clippingPlanes = frustum.planes;
    gl.render(scene, camera);

    // Restore WebGLRender Options
    scene.overrideMaterial = null;
    gl.clippingPlanes = [];

    /* eslint-enable no-param-reassign */
  }, 10);

  return null;
}

interface CameraProps extends MeshProps {
  type?: string;
  width?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
  roll?: number;
  helper?: boolean;
  meshColor?: string;
  wireframeColor?: string;
  coverageColor?: string;
  coverageOpacity?: number;
  showUp?: boolean;
  showNormal?: boolean;
  showRoll?: boolean;
  showLookAt?: boolean;
  showLabel?: boolean;
  labelText?: string;
  labelOffset?: Array<number>;
  target?: Array<number>;
  cull?: boolean;
}

/**
 * Camera
 *
 * Camera's up prop may be given by the user. The camera's true up will be a projection of the
 * given up. This way you can have a tilted camera and just provide the up of the world space and
 * the camera will orient such that the project of the true up is aligned with the world space up.
 */
const Camera: React.FunctionComponent<CameraProps> = function Camera({
  // THREE Camera Props
  type = "perspective",
  left,
  right,
  top,
  bottom,
  near = EPS,
  far = 1000,
  fov = 50,
  width = 1,
  height = 1,
  aspect = width / height,
  //  Camera Props
  position = [0, 0, 0],
  normal = DEFAULT_NORMAL,
  target,
  rotation = [0, 0, 0],
  eulerOrder = EULER_ORDERS.XYZ,
  quaternion,
  up,
  roll = 0,
  helper = false,
  showUp = false,
  showNormal = false,
  showRoll = false,
  showLookAt = false,
  showLabel = true,
  labelOffset = [0, 0, 1.5],
  labelText = "cam",
  // Coverage
  cull = false,
  coverageColor,
  coverageOpacity = 1,
  // Shadow Props
  castShadow = false,
  receiveShadow = false,
  // Wireframe
  wireframeColor,
  children,
  ...otherProps
}) {
  // Target / Normal
  const initialNormal = useMemo(
    function updateNormal() {
      if (target) {
        const posVec = new THREE.Vector3(...position);
        const targetVec = new THREE.Vector3(...target);
        const lookAtVec = targetVec
          .clone()
          .sub(posVec)
          .normalize();
        // LookAt is opposite direction of Normal
        return [-lookAtVec.x, -lookAtVec.y, -lookAtVec.z];
      }

      return objectToArray(new THREE.Vector3(...normal).normalize());
    },
    [target, normal, position]
  );

  // THREE.Camera
  const camera = useMemo(
    function updateCamera() {
      let cam;
      if (camera) {
        cam = camera;
      } else {
        const _left = left != null ? left : -width * 0.5;
        const _right = right != null ? right : width * 0.5;
        const _top = top != null ? top : height * 0.5;
        const _bottom = bottom != null ? bottom : -height * 0.5;

        switch (type) {
          case "orthographic":
            cam = new THREE.OrthographicCamera(
              _left,
              _right,
              _top,
              _bottom,
              near,
              far
            );
            break;
          case "perspective":
            cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
            break;
          default:
            /* eslint-disable-next-line no-console */
            console.warn(`[Camera] Invalid camera type: ${type}`);
        }
      }

      // Camera Extrinsics
      cam.position.set(...position);
      // cam.up is only used for determining the axis of rotaion for orbitControls or mapControls,
      // this up does not affect the quaternion of the Camera
      if (up != null) {
        cam.up.set(...up);
      } else {
        cam.up.set(...DEFAULT_UP);
      }
      // Note: THREE's Camera's actual normal is inverse of the lookAt
      // Since THREE Camera's quaternion is readOnly and may only be manipulated by methods,
      // must use lookAt().
      // Reset LookAt
      cam.lookAt(...position.map((val, i) => val - DEFAULT_NORMAL[i]));

      // Normal
      // @ts-ignore:T2345 // spread
      const normalVec = new THREE.Vector3(...initialNormal);
      const normalQ = new THREE.Quaternion().setFromUnitVectors(
        DEFAULT_NORMAL_VEC3,
        normalVec
      );

      // Rotation / Quaternion
      let rotationQ = new THREE.Quaternion();
      if (quaternion == null) {
        let _eulerOrder = eulerOrder.toUpperCase();
        _eulerOrder = EULER_ORDERS[_eulerOrder]
          ? _eulerOrder
          : EULER_ORDERS.XYZ;
        const euler = new THREE.Euler(...rotation, _eulerOrder);
        rotationQ = new THREE.Quaternion().setFromEuler(euler);
      } else {
        rotationQ = toQuaternion(quaternion);
      }

      // Up
      // If an up prop is provided, the camera with align the roll so that the true up vector of
      // the Camera is aligned with the projection of the given up vector in the
      // Camera's image plane.
      let upAlignAngle = 0;
      if (up != null) {
        const qNormalAndRotation = cam.quaternion
          .clone()
          .premultiply(rotationQ)
          .premultiply(normalQ);
        const givenUpVec = new THREE.Vector3(...up).normalize();
        const lookAtVec = DEFAULT_NORMAL_VEC3.clone()
          .applyQuaternion(qNormalAndRotation)
          .multiplyScalar(-1);
        const rightVec = new THREE.Vector3().crossVectors(
          givenUpVec,
          lookAtVec
        );

        const projectedUpVec = new THREE.Vector3().crossVectors(
          lookAtVec,
          rightVec
        );
        const trueUpVec = DEFAULT_UP_VEC3.clone().applyQuaternion(
          qNormalAndRotation
        );
        const upAlignSign = trueUpVec.clone().dot(rightVec) > 0 ? -1 : 1;
        upAlignAngle = trueUpVec.angleTo(projectedUpVec) * upAlignSign;
      }

      // Roll
      // The normal is inverse of the lookAt so the roll must be negated
      const _roll = (-roll + upAlignAngle) % (Math.PI * 2);
      const rollQ = new THREE.Quaternion().setFromAxisAngle(
        DEFAULT_NORMAL_VEC3,
        _roll
      );

      // cam.quaternion = normalQ * rotationQ * rollQ
      cam.quaternion.premultiply(rollQ);
      cam.quaternion.premultiply(rotationQ);
      cam.quaternion.premultiply(normalQ);
      cam.updateMatrixWorld();

      return cam;
    },
    [
      position,
      up,
      initialNormal,
      quaternion,
      roll,
      left,
      width,
      right,
      top,
      height,
      bottom,
      type,
      near,
      far,
      fov,
      aspect,
      eulerOrder,
      rotation
    ]
  );

  const cameraNormal = useMemo(
    function updateNormal() {
      return objectToArray(
        DEFAULT_NORMAL_VEC3.clone().applyQuaternion(camera.quaternion)
      );
    },
    [camera]
  );

  const cameraLookAt = useMemo(
    function updateLookAt() {
      return [-cameraNormal[0], -cameraNormal[1], -cameraNormal[2]];
    },
    [cameraNormal]
  );

  // Camera Helper
  const cameraHelper = useMemo(
    function updateCameraHelper() {
      if (!helper || !camera) {
        return null;
      }

      return new THREE.CameraHelper(camera);
    },
    [camera, helper]
  );

  // Frustum
  const frustum = useMemo(
    function updateFrustum() {
      // Camera Frustum
      const frus = new THREE.Frustum();
      frus.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse
        )
      );

      return frus;
    },
    [camera]
  );

  return (
    <>
      <Group position={position} {...otherProps}>
        {/* Camera  */}
        <Group quaternion={camera.quaternion}>
          <Box
            scale={[1, 1, 1.4]}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
          />
          <Cylinder
            start={[0, 0, -0.7]}
            end={[0, 0, -1]}
            radiusBottom={0.3}
            radiusTop={0.3}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
          />
          {/* Roll */}
          {/* Camera's Normal is inverse of LookAt */}
          {showRoll && (
            <>
              <Arrow head={DEFAULT_UP.map(val => val * 2)} color="yellow" />
              <Arrow
                head={DEFAULT_UP.map(val => val * 2)}
                color="yellow"
                opacity={0.3}
                roll={roll}
              />
              <Circle
                color="yellow"
                thetaLength={roll % (Math.PI * 2)}
                thetaStart={Math.PI * 0.5 - roll}
                normal={[0, 0, -1]}
                opacity={0.3}
              />
              <Text
                text={`local roll: ${roll}`}
                position={DEFAULT_UP.map(val => val * 2.2)}
                color="yellow"
                align="center"
                size={0.2}
                billboard
              />
            </>
          )}
        </Group>
        {/* Wireframe */}
        {wireframeColor && (
          <Group quaternion={camera.quaternion}>
            <Box
              scale={[1, 1, 1.4]}
              color={wireframeColor}
              wireframe
              ignoreMouseEvents
            />
            <Cylinder
              start={[0, 0, -0.7]}
              end={[0, 0, -1]}
              radiusBottom={0.3}
              radiusTop={0.3}
              color={wireframeColor}
              wireframe
              ignoreMouseEvents
            />
          </Group>
        )}
        {/* Up */}
        {showUp && (
          <>
            <Arrow
              head={[camera.up.x * 2, camera.up.y * 2, camera.up.z * 2]}
              color="cyan"
            />
            <Text
              text="up"
              position={[
                camera.up.x * 2.2,
                camera.up.y * 2.2,
                camera.up.z * 2.2
              ]}
              color="cyan"
              align="center"
              size={camera.up.length() * 0.2}
              billboard
            />
          </>
        )}
        {/* Normal */}
        {showNormal && (
          <>
            <Arrow head={cameraNormal.map(val => val * 2)} color="lime" />
            <Text
              text="normal"
              position={cameraNormal.map(val => val * 2.2)}
              color="lime"
              align="center"
              size={0.2}
              billboard
            />
          </>
        )}
        {/* LookAt */}
        {showLookAt && (
          <>
            <Arrow head={cameraLookAt.map(val => val * 2)} color="magenta" />
            <Text
              text="look"
              position={cameraLookAt.map(val => val * 2.2)}
              color="magenta"
              align="center"
              size={0.2}
              billboard
            />
          </>
        )}
        {/* Label */}
        {showLabel && (
          <Label
            position={labelOffset}
            up={[0, 0, 1]}
            text={labelText}
            animation={billboard}
          />
        )}
        {children}
      </Group>

      {/* Helper */}
      {helper && <primitive object={cameraHelper} />}

      {/* Cull */}
      <CullCoverage
        frustum={frustum}
        cull={cull}
        coverageColor={coverageColor}
        coverageOpacity={coverageOpacity}
      />
    </>
  );
};

// -----  PropTypes   ----- //
Camera.propTypes = exact({
  type: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
  bottom: PropTypes.number,
  near: PropTypes.number,
  far: PropTypes.number,
  fov: PropTypes.number,
  aspect: PropTypes.number,
  meshColor: PropTypes.string,
  wireframeColor: PropTypes.string,
  coverageColor: PropTypes.string,
  coverageOpacity: PropTypes.number,
  helper: PropTypes.bool,
  showLabel: PropTypes.bool,
  showUp: PropTypes.bool,
  showNormal: PropTypes.bool,
  showRoll: PropTypes.bool,
  showLookAt: PropTypes.bool,
  labelText: PropTypes.string,
  labelOffset: propTypeNumberArrayOfLength(3),
  target: propTypeNumberArrayOfLength(3),
  cull: PropTypes.bool,
  ...MeshPropTypes
});

const CameraMemo = memo(Camera);
CameraMemo.displayName = "Camera";
export default CameraMemo;
