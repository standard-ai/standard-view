// SetControls.tsx
import * as React from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import _ from "lodash";
import { useFrame, useViewContext } from "../utils/hooks";
import { OrbitControls, MapControls } from "../controls/OrbitControls";
import {
  CONTROLS_TYPES,
  DEFAULT_UP_VEC3,
  DEFAULT_NORMAL_VEC3
} from "../utils/constants";
import { EPS } from "../utils/math";

const { useEffect, useState, useMemo, memo } = React;

function SetControls({
  controlsType,
  cameraExtrinsics,
  polarAngle,
  azimuthAngle,
  controlsProps
}): null {
  const { camera, gl } = useViewContext();

  // Set CameraControls
  const CameraControls = useMemo(
    function updateCameraControls() {
      switch (controlsType) {
        case CONTROLS_TYPES.TRACKBALL_CONTROLS:
          return TrackballControls;
        case CONTROLS_TYPES.ORBIT_CONTROLS:
          return OrbitControls;
        case CONTROLS_TYPES.MAP_CONTROLS:
          return MapControls;
        default:
          return null;
      }
    },
    [controlsType]
  );

  const [_controlsProps, setControlsProps] = useState(controlsProps);
  useEffect(
    function updateControlsProps() {
      // Update Controls Props
      if (!_.isEqual(_controlsProps, controlsProps)) {
        setControlsProps(controlsProps);
      }
    },
    [controlsProps, _controlsProps]
  );

  const [_cameraExtrinsics, setCameraExtrinsics] = useState(cameraExtrinsics);
  useEffect(
    function updateCameraExtrinsics() {
      // Update Camera Extrinsics
      if (!_.isEqual(_cameraExtrinsics, cameraExtrinsics)) {
        setCameraExtrinsics(cameraExtrinsics);
      }
    },
    [cameraExtrinsics, _cameraExtrinsics]
  );

  useEffect(
    function updateCameraControls() {
      // Clear Camera Controls
      if (camera.controls != null) {
        camera.controls.dispose();
        camera.controls = null;
      }

      // Camera Extrinsics
      const { position, up, target, rotation, roll } = _cameraExtrinsics;
      camera.position.set(...position);
      camera.up = new THREE.Vector3(...up).normalize();
      camera.target = new THREE.Vector3(...target);
      camera.lookAt(camera.target);
      if (rotation) {
        // Default rotation is camera pointing in z-axis with up as y-axis.
        camera.rotation.set(...rotation);
      }

      // Apply Camera Roll
      camera.roll = roll;
      const look = target.map((val, i) => val - position[i]);
      const lookVec = new THREE.Vector3(...look).normalize();
      const rollQ = new THREE.Quaternion().setFromAxisAngle(
        lookVec,
        camera.roll
      );
      camera.quaternion.premultiply(rollQ);

      // Prevent gimble lock from parallel look and up
      if (1 - Math.abs(camera.up.clone().dot(lookVec)) < EPS) {
        // Offset toward DEFAULT_UP or DEFAULT_NORMAL
        const offset =
          1 - Math.abs(DEFAULT_UP_VEC3.clone().dot(camera.up)) < EPS
            ? DEFAULT_NORMAL_VEC3.clone()
            : DEFAULT_UP_VEC3.clone();
        offset.multiplyScalar(EPS);
        camera.up.add(offset).normalize();
        console.warn(
          `[View3D.camera] up and look (target - position) directions are parallel. up has been slightly offset to prevent unexpected camera controls behavior.`
        );
      }
      camera.up.applyQuaternion(rollQ);

      // Initialize Camera Controls
      if (CameraControls != null) {
        // @ts-ignore:TS2351 new
        camera.controls = new CameraControls(
          camera,
          gl.domElement,
          polarAngle,
          azimuthAngle
        );
        camera.controls.enabled = true;
      }

      camera.updateProjectionMatrix();
    },
    [
      CameraControls,
      camera,
      _cameraExtrinsics,
      polarAngle,
      azimuthAngle,
      gl.domElement
    ]
  );

  useEffect(
    function updateCameraControlsProps() {
      // Update Camera Controls
      if (CameraControls != null) {
        if (_controlsProps) {
          Object.entries(_controlsProps).map(([param, value]) => {
            camera.controls[param] = value;
            return null;
          });
        }

        camera.controls.update();
      }
    },
    [CameraControls, camera, _controlsProps]
  );

  return null;
}

const SetControlsMemo = memo(SetControls);
SetControlsMemo.displayName = "SetControls";
export default SetControlsMemo;

/**
 * UpdateControls
 *
 * Isolates the useFrame hook to avoid larger components, namely
 * SetControls, from re-rendering up to 3 times--this is a bug
 * from react-three-fiber.
 * Any react-three-fiber hook call incurs additional renders.
 */
export const UpdateControls = memo(function UpdateControls(): null {
  const { camera } = useViewContext();

  useFrame(function updateControls() {
    if (camera.controls != null) {
      camera.controls.update();
    }
  });

  return null;
});
UpdateControls.displayName = "UpdateControls";
