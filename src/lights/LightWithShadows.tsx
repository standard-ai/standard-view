// LightWithShadows.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { useFrame, useViewContext } from "../utils/hooks";
import { nextPowerOfTwo, EPS } from "../utils/math";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useEffect, useMemo, memo } = React;

// -------------------------------------- //
// -----   CommonLightWithShadows   ----- //
// -------------------------------------- //
export interface CommonLightWithShadowsProps {
  position?: Array<number>;
  intensity?: number;
  color?: string | THREE.Color;
  castShadow?: boolean;
  shadowCameraNear?: number;
  shadowCameraFar?: number;
  shadowMapWidth?: number;
  shadowMapHeight?: number;
  helper?: boolean;
  helperColor?: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children?: any;
}

export const CommonLightWithShadowsPropTypes = {
  position: propTypeNumberArrayOfLength(3),
  target: propTypeNumberArrayOfLength(3),
  color: PropTypes.string,
  intensity: PropTypes.number,
  castShadow: PropTypes.bool,
  shadowCameraNear: PropTypes.number,
  shadowCameraFar: PropTypes.number,
  shadowMapWidth: PropTypes.number,
  shadowMapHeight: PropTypes.number,
  helper: PropTypes.bool,
  helperColor: PropTypes.string,
  helperSize: PropTypes.number
};

// -------------------------------- //
// -----   LightWithShadows   ----- //
// -------------------------------- //

interface LightWithShadowsProps extends CommonLightWithShadowsProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  THREELight: any;
  THREEHelper: any;
  lightParams: Array<any>;
  helperParams: Array<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  target?: Array<number>;
}

/**
 * LightWithShadows
 *
 * Similar to the Mesh component, the Light component is what most lights
 * are under the hood.
 *
 * However, unlike Mesh--which actually boils down to a
 * three.js Mesh component, Light does not boil down to any specific three.js
 * component. Instead, Light is like an abstraction to reduce repetitive setup
 * that is common to DirectionalLight, SpotLight, and PointLight.
 *
 * Technically, the specific three.js light constructor and helper constructor
 * is passed in through the THREELight and THREEHelper props.
 *
 * Just as in three.js, Light is an abstract base class, in Standard View, Light
 * is like an "abstract" base component.
 */
const LightWithShadows: React.FunctionComponent<
  LightWithShadowsProps
> = function LightWithShadows({
  THREELight,
  THREEHelper,
  lightParams,
  helperParams,
  position = [0, 0, 1],
  target,
  castShadow = false,
  shadowCameraNear = 0.1,
  shadowCameraFar = 100,
  shadowMapWidth = 1024,
  shadowMapHeight = 1024,
  helper = false,
  ...otherProps
}) {
  // Light
  const light = useMemo(
    function createLight() {
      return new THREELight(...lightParams);
    },
    [lightParams, THREELight]
  );

  // Position
  useEffect(
    function updatePosition() {
      // @ts-ignore:TS2569 spread
      light.position.set(...position);
    },
    [light, position]
  );

  // Target
  const { scene } = useViewContext();
  useEffect(
    function updateTarget() {
      if (light.target && target) {
        // light.target must be Object3D
        if (Array.isArray(target)) {
          light.target.position.set(...target);
        }

        scene.add(light.target);
      }
    },
    [light, scene, target]
  );

  // Check position overlap with target
  useEffect(
    function checkPositionTarget() {
      if (!light.target) {
        return;
      }

      // Check position overlap target
      const pos = position;
      const tpos = light.target.position;
      if (pos[0] === tpos.x && pos[1] === tpos.y && pos[2] === tpos.z) {
        /* eslint-disable-next-line no-console */
        console.warn(
          "[LightWithShadows] position and target cannot be the same!"
        );

        /* eslint-disable no-param-reassign */
        position[2] += EPS;
        light.position.z += EPS;
        /* eslint-enable no-param-reassign */
      }
    },
    [light, position, target]
  );

  // Shadows
  useEffect(
    function updateShadows() {
      light.castShadow = castShadow;
      light.shadow.camera.near = shadowCameraNear;
      light.shadow.camera.far = shadowCameraFar;
      light.shadow.mapSize.width = nextPowerOfTwo(shadowMapWidth);
      light.shadow.mapSize.height = nextPowerOfTwo(shadowMapHeight);
    },
    [
      light,
      castShadow,
      shadowCameraNear,
      shadowCameraFar,
      shadowMapWidth,
      shadowMapHeight
    ]
  );

  // Helper Params
  // Helper needs a reference to light as the first param.
  const _helperParams = useMemo(
    function updateHelperParams() {
      return [light, ...helperParams];
    },
    [light, helperParams]
  );

  return (
    <>
      {/*
      // @ts-ignore:2339 property primitive does not exist */}
      <primitive object={light} {...otherProps} />
      {helper && (
        <LightWithShadowsHelper
          THREEHelper={THREEHelper}
          helperParams={_helperParams}
          helper={helper}
        />
      )}
    </>
  );
};

// -----  PropTypes   ----- //
LightWithShadows.propTypes = exact({
  THREELight: PropTypes.func.isRequired, // THREE.Light -- specific
  THREEHelper: PropTypes.func.isRequired, // THREE.LightHelper -- specific
  lightParams: PropTypes.arrayOf(PropTypes.any).isRequired,
  helperParams: PropTypes.arrayOf(PropTypes.any).isRequired,
  ...CommonLightWithShadowsPropTypes
});

const LightWithShadowsMemo = memo(LightWithShadows);
LightWithShadowsMemo.displayName = "LightWithShadows";
export default LightWithShadowsMemo;

// -------------------------------------- //
// -----   LightWithShadowsHelper   ----- //
// -------------------------------------- //
/**
 * UpdateLightWithShadowsHelper
 *
 * Isolates the useFrame hook to avoid larger components, namely
 * CreateLightHelper, from re-rendering up to 3 times--this is
 * a bug from react-three-fiber.
 * Any react-three-fiber hook call incurs additional renders.
 */
function UpdateLightWithShadowsHelper({ helper, lightHelper }): null {
  useFrame(function updateHelper() {
    if (helper) {
      lightHelper.update();
    }
  }, 2);

  return null;
}

interface LightWithShadowsHelperProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  THREEHelper: any;
  helperParams: Array<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  helper: boolean;
}

/**
 * LightWithShadowsHelper
 *
 * Generates light helper object and also adds the update
 * function in three.js's render loop.
 */
const LightWithShadowsHelper: React.FunctionComponent<
  LightWithShadowsHelperProps
> = function LightWithShadowsHelper({ THREEHelper, helperParams, helper }) {
  const lightHelper = useMemo(
    function updateTHREEHelper() {
      return new THREEHelper(...helperParams);
    },
    [helperParams, THREEHelper]
  );

  if (!helper) {
    return null;
  }

  return (
    <>
      <UpdateLightWithShadowsHelper helper={helper} lightHelper={lightHelper} />
      <primitive object={lightHelper} />
    </>
  );
};

// -----  PropTypes   ----- //
LightWithShadowsHelper.propTypes = {
  THREEHelper: PropTypes.func.isRequired,
  helperParams: PropTypes.arrayOf(PropTypes.any).isRequired,
  helper: PropTypes.bool.isRequired
};
