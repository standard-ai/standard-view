// PointLight.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import LightWithShadows, {
  CommonLightWithShadowsProps,
  CommonLightWithShadowsPropTypes
} from "./LightWithShadows";

const { useMemo, memo } = React;

interface PointLightProps extends CommonLightWithShadowsProps {
  distance?: number;
  decay?: number;
  helperSize?: number;
}

const PointLight: React.FunctionComponent<
  PointLightProps
> = function PointLight({
  color = "white",
  intensity = 1,
  distance = 0,
  decay = 1,
  helperSize = 1,
  helperColor,
  ...otherProps
}) {
  const lightParams = useMemo(
    function updateLightParams() {
      return [color, intensity, distance, decay];
    },
    [color, intensity, distance, decay]
  );

  const helperParams = useMemo(
    function updateHelperParams() {
      return [helperSize, helperColor || color];
    },
    [helperSize, helperColor, color]
  );

  return (
    <LightWithShadows
      THREELight={THREE.PointLight}
      THREEHelper={THREE.PointLightHelper}
      lightParams={lightParams}
      helperParams={helperParams}
      {...otherProps}
    />
  );
};

// -----  PropTypes   ----- //
PointLight.propTypes = exact({
  distance: PropTypes.number,
  decay: PropTypes.number,
  ...CommonLightWithShadowsPropTypes
});

const PointLightMemo = memo(PointLight);
PointLightMemo.displayName = "PointLight";
export default PointLightMemo;
