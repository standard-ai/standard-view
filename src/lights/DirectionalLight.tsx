// DirectionalLight.tsx
import * as React from "react";
import * as THREE from "three";
import exact from "prop-types-exact";
import LightWithShadows, {
  CommonLightWithShadowsProps,
  CommonLightWithShadowsPropTypes
} from "./LightWithShadows";

const { useMemo, memo } = React;

interface DirectionalLightProps extends CommonLightWithShadowsProps {
  target?: Array<number>;
  helperSize?: number;
}

const DirectionalLight: React.FunctionComponent<
  DirectionalLightProps
> = function DirectionalLight({
  color = "white",
  intensity = 1,
  helperSize = 1,
  helperColor,
  ...otherProps
}) {
  const lightParams = useMemo(
    function updateLightParams() {
      return [color, intensity];
    },
    [color, intensity]
  );

  const helperParams = useMemo(
    function updateHelperParams() {
      return [helperSize, helperColor || color];
    },
    [helperSize, helperColor, color]
  );

  return (
    <LightWithShadows
      THREELight={THREE.DirectionalLight}
      THREEHelper={THREE.DirectionalLightHelper}
      lightParams={lightParams}
      helperParams={helperParams}
      {...otherProps}
    />
  );
};

// -----  PropTypes   ----- //
DirectionalLight.propTypes = exact({
  ...CommonLightWithShadowsPropTypes
});

const DirectionalLightMemo = memo(DirectionalLight);
DirectionalLightMemo.displayName = "DirectionalLight";
export default DirectionalLightMemo;
