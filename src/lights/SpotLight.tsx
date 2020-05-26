// SpotLight.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import LightWithShadows, {
  CommonLightWithShadowsProps,
  CommonLightWithShadowsPropTypes
} from "./LightWithShadows";

const { useMemo, memo } = React;

interface SpotLightProps extends CommonLightWithShadowsProps {
  distance?: number;
  decay?: number;
  angle?: number;
  penumbra?: number;
}

const SpotLight: React.FunctionComponent<SpotLightProps> = function SpotLight({
  color = "white",
  intensity = 1,
  distance = 0,
  decay = 1,
  angle = Math.PI * 0.333,
  penumbra = 0,
  helperColor,
  ...otherProps
}) {
  const lightParams = useMemo(
    function updateLightParams() {
      return [color, intensity, distance, angle, penumbra, decay];
    },
    [color, intensity, distance, angle, penumbra, decay]
  );

  const helperParams = useMemo(
    function updateHelperParams() {
      return [helperColor || color];
    },
    [helperColor, color]
  );

  return (
    <LightWithShadows
      THREELight={THREE.SpotLight}
      THREEHelper={THREE.SpotLightHelper}
      lightParams={lightParams}
      helperParams={helperParams}
      {...otherProps}
    />
  );
};

// -----  PropTypes   ----- //
SpotLight.propTypes = exact({
  distance: PropTypes.number,
  decay: PropTypes.number,
  angle: PropTypes.number,
  penumbra: PropTypes.number,
  ...CommonLightWithShadowsPropTypes
});

const SpotLightMemo = memo(SpotLight);
SpotLightMemo.displayName = "SpotLight";
export default SpotLightMemo;
