// View3D.tsx
import * as React from "react";
import { Canvas, useThree } from "react-three-fiber";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import SetRenderer from "./SetRenderer";
import SetBackground from "./SetBackground";
import SetShadows from "./SetShadows";
import SetControls, { UpdateControls } from "./SetControls";
import { GenerateContextListeners, ContextBridge } from "./ContextBridge";
import { ViewContextProvider } from "./ViewContext";
import { reconcileSynonymousProps } from "../utils/util";
import {
  SYNONYMOUS_CONTROLS_PROPS,
  ANTONYMOUS_CONTROLS_PROPS,
  SYNONYMOUS_CAMERA_PROPS,
  CONTROLS_TYPES,
  CAMERA_TYPES,
  DEFAULT_UP
} from "../utils/constants";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version } = require("../../package.json");

const { useRef, useEffect, useMemo, memo } = React;

interface View3DProps {
  backgroundColor?: string;
  backgroundTextureURL?: string;
  backgroundEquirectangularTextureURL?: string;
  backgroundEquirectangularRGBEURL?: string;
  trackballControls?: boolean;
  orbitControls?: boolean;
  mapControls?: boolean;
  shadowMapEnabled?: boolean;
  shadowType?: string;
  orthographic?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  camera?: any; // Object
  controls?: any; // Object
  gl?: any; // Object
  contexts?: React.Context<any> | Array<React.Context<any>>;
  style?: Record<string, any>;
  children: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * View3D
 *
 * In Standard View, View3D creates the react-three-fiber Canvas
 * and also applies some extra features, such as setting the
 * background color/texture/equirectangular texture.
 * For react-three-fiber, this is not possible since the background
 * color or texture is not a THREE.WebGLRenderer parameter with a setter.
 * Since react-three-fiber does not provide an easy way to call methods
 * of three.js objects, View3D provides the settings for the Canvas
 * that react-three-fiber does not.
 *
 * All other react-three-fiber functionality for its Canvas properties
 * are maintained and applied, since the View3D specific properties are
 * stripped out.
 *
 * Camera controls may be enable by passing in true for either trackballControls
 * orbitControls, or mapControls. Camera controls parameters may be passed with the controls
 * prop in the form of an Object, similar to camera's props.
 *
 * SetCanvasProps is a small component that isolates the useThree hook.
 * Unfortunately, react-three-fiber hooks incur additional renders,
 * hence those hooks have been encapsulated into small components to avoid
 * re-rendering larger more complicated logic. Similarly, UpdateCameraControls
 * isolates the useThree hook.
 *
 * SetBackground, SetShadows, and SetControls contain logic encapsulated in
 * components because these changes cannot be applied through react-three-fiber
 * props on Canvas. Also, this logic cannot be applied in the body of View3D
 * since background, shadows, and camera controls depends on the creation of
 * Canvas and ultimately mutate the Canvas Properties, namely camera, gl,
 * and scene. Thus this logic must execute in components after Canvas is created
 * and within the Canvas component.
 *
 * Any number of React contexts may be passed into View3D. Since react-three-fiber
 * provides its own render method and reconciler, contexts must be maintained via
 * a context bridge. In order to permeate contexts into View3D, pass an array of
 * all contexts to the contexts prop.
 * Also, ViewContext will always provide Canvas Props so that all components in a
 * particular View3D has access to those particular react-three-fiber
 * Canvas Props (gl, scene, camera, etc)
 *
 * @param {View3DProps} props
 */
const View3D: React.FunctionComponent<View3DProps> = function View3D({
  trackballControls,
  orbitControls,
  mapControls,
  backgroundColor,
  backgroundTextureURL,
  backgroundEquirectangularTextureURL,
  backgroundEquirectangularRGBEURL,
  shadowMapEnabled = false,
  shadowType = "pcfsoft",
  camera,
  controls,
  gl,
  orthographic,
  contexts,
  children,
  ...otherProps
}) {
  // Print Standard View Version
  useEffect(() => {
    /* eslint-disable-next-line no-console */
    console.log(`%cStandard View Core ${version}`, "color: orange");
  }, []);

  // -----   Contexts   -----//
  const _contexts = useMemo(
    function updateContexts() {
      if (contexts) {
        // Handle Single Context (non Array) or Multiple Contexts (Array)
        return Array.isArray(contexts) ? contexts : [contexts];
      } else {
        return [];
      }
    },
    [contexts]
  );

  // -----   Canvas Props   -----//
  const canvasProps = useRef();

  // -----   gl Props   -----//
  const { glParameters, glProps } = useMemo(
    function updateGLProps() {
      // WebGLRenderer Parameters on Initialization
      const glParameterKeys = [
        "context",
        "precision",
        "alpha",
        "premultipliedAlpha",
        "antialias",
        "stencil",
        "preserveDrawingBuffer",
        "powerPreference",
        "failIfMajorPerformanceCaveat",
        "depth",
        "logarithmicDepthBuffer"
      ];

      /* eslint-disable no-shadow */
      const glParameters = { antialias: true, preserveDrawingBuffer: true };
      const glProps = {};
      /* eslint-enable no-shadow */

      // Extract glParams and glProps
      if (gl) {
        Object.entries(gl).map(([key, value]) => {
          if (glParameterKeys.includes(key)) {
            glParameters[key] = value;
          } else {
            glProps[key] = value;
          }

          return null;
        });
      }

      return { glParameters, glProps };
    },
    [gl]
  );

  // -----   Background   -----//
  const backgroundProps = useMemo(
    function updateBackgroundProps() {
      return {
        backgroundColor,
        backgroundTextureURL,
        backgroundEquirectangularTextureURL,
        backgroundEquirectangularRGBEURL
      };
    },
    [
      backgroundColor,
      backgroundTextureURL,
      backgroundEquirectangularTextureURL,
      backgroundEquirectangularRGBEURL
    ]
  );

  // -----   Shadows   -----//
  const shadowProps = useMemo(
    function updateShadowProps() {
      return {
        shadowMapEnabled: shadowMapEnabled || true,
        shadowType: shadowType || "type"
      };
    },
    [shadowMapEnabled, shadowType]
  );

  // -----   Camera Controls   ----- //
  const cameraType = useMemo(
    function updateCameraType() {
      return orthographic
        ? CAMERA_TYPES.ORTHOGRAPHIC
        : CAMERA_TYPES.PERSPECTIVE;
    },
    [orthographic]
  );
  const controlsType = useMemo(
    function updateControlsType() {
      if (orbitControls) {
        return CONTROLS_TYPES.ORBIT_CONTROLS;
      } else if (trackballControls) {
        return CONTROLS_TYPES.TRACKBALL_CONTROLS;
      } else if (mapControls) {
        return CONTROLS_TYPES.MAP_CONTROLS;
      }

      return "none";
    },
    [orbitControls, trackballControls, mapControls]
  );

  // -----   Camera Props   -----//
  const { cameraExtrinsics, cameraProps } = useMemo(
    function updateCameraProps() {
      /* eslint-disable no-shadow */
      const {
        position = [0, 0, 5],
        target = [0, 0, 0],
        up = DEFAULT_UP,
        rotation = undefined,
        roll = 0,
        ...cameraProps
      } = camera || {};

      const cameraExtrinsics = {
        position,
        target,
        up,
        rotation,
        roll
      };
      /* eslint-enable no-shadow */

      return { cameraExtrinsics, cameraProps };
    },
    [camera]
  );
  const updateDefaultCamera = useMemo(
    function updateUpdateDefaultCamera() {
      // No Camera Props
      if (camera == null) {
        return true;
      }

      if (camera.updateDefaultCamera != null) {
        return camera.updateDefaultCamera;
      } else if (
        // Fixed orthographic left, right, top, bottom
        orthographic &&
        (camera.left != null ||
          camera.right != null ||
          camera.top != null ||
          camera.bottom != null)
      ) {
        return false;
      } else if (!orthographic && camera.aspect != null) {
        // Fixed aspect
        return false;
      } else {
        return true;
      }
    },
    [camera, orthographic]
  );

  // -----   Controls Props   ----- //
  const controlsProps = useMemo(
    function updateControlsProps() {
      // Extract Angles of Rotation
      /* eslint-disable-next-line no-shadow */
      const { polarAngle = 0, azimuthAngle = 0, ...controlsProps } =
        controls || {};

      // Reconcile Control Props
      if (controlsType !== "none") {
        reconcileSynonymousProps(
          controlsProps,
          SYNONYMOUS_CONTROLS_PROPS,
          controlsType
        );
        reconcileSynonymousProps(
          controlsProps,
          ANTONYMOUS_CONTROLS_PROPS,
          controlsType,
          true
        );
      }
      reconcileSynonymousProps(
        controlsProps,
        SYNONYMOUS_CAMERA_PROPS,
        cameraType
      );

      return {
        controlsType,
        polarAngle,
        azimuthAngle,
        cameraExtrinsics,
        controlsProps:
          Object.keys(controlsProps).length > 0 ? controlsProps : undefined
      };
    },
    [controlsType, cameraType, controls, cameraExtrinsics]
  );

  const values = useRef([]);
  /* eslint-disable react-hooks/exhaustive-deps */
  const contextListeners = useMemo(
    function generateContextListeners() {
      return GenerateContextListeners(_contexts, values.current);
    },
    [_contexts]
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      {contextListeners}
      <Canvas
        camera={cameraProps}
        orthographic={orthographic}
        updateDefaultCamera={updateDefaultCamera}
        // @ts-ignore:TS2559 no properties in common with Partial<WebGLRenderer>
        gl={glParameters}
        {...otherProps}
      >
        <SetCanvasProps canvasProps={canvasProps} />
        <ViewContextProvider canvasProps={canvasProps}>
          <ContextBridge contexts={_contexts} values={values.current}>
            <SetRenderer {...glProps} />
            <SetBackground {...backgroundProps} />
            <SetShadows {...shadowProps} />
            <SetControls {...controlsProps} />
            {(mapControls ||
              trackballControls ||
              (controls && controls.autoRotate)) && <UpdateControls />}
            {children}
          </ContextBridge>
        </ViewContextProvider>
      </Canvas>
    </>
  );
};

// -----  PropTypes   ----- //
/* eslint-disable react/forbid-prop-types */
View3D.propTypes = exact({
  backgroundColor: PropTypes.string,
  backgroundTextureURL: PropTypes.string,
  backgroundEquirectangularTextureURL: PropTypes.string,
  backgroundEquirectangularRGBEURL: PropTypes.string,
  trackballControls: PropTypes.bool,
  orbitControls: PropTypes.bool,
  mapControls: PropTypes.bool,
  shadowMapEnabled: PropTypes.bool,
  shadowType: PropTypes.string,
  camera: PropTypes.object, // CameraProps
  controls: PropTypes.object, // ControlsProps
  gl: PropTypes.object, // glProps
  orthographic: PropTypes.bool,
  contexts: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.any
  ]), // Array<React.Context> | React.Context
  style: PropTypes.object,
  children: PropTypes.any
});
/* eslint-enable react/forbid-prop-types */

const View3DMemo = memo(View3D);
View3DMemo.displayName = "View3D";
export default View3DMemo;

/**
 * SetCanvasProps
 *
 * Isolates the useThree hook to avoid larger components from
 * re-rendering up to 3 times--this is a bug from react-three-fiber.
 * Any react-three-fiber hook call incurs additional renders.
 */
const SetCanvasProps = memo(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function SetCanvasProps({ canvasProps }: any) {
    /* eslint-disable-next-line no-param-reassign */
    canvasProps.current = useThree();
    return null;
  },
  () => true
);
SetCanvasProps.displayName = "SetCanvasProps";
