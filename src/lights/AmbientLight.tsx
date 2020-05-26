// AmbientalLight.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";

const { useMemo, memo } = React;

interface AmbientLightProps {
  color?: string | THREE.Color;
  intensity?: number;
}

const AmbientLight: React.FunctionComponent<
  AmbientLightProps
> = function AmbientLight({ color = "white", intensity = 1, ...otherProps }) {
  const _color = useMemo(
    function updateColor() {
      return new THREE.Color(color);
    },
    [color]
  );

  return <ambientLight color={_color} intensity={intensity} {...otherProps} />;
};

// -----  PropTypes   ----- //
AmbientLight.propTypes = exact({
  color: PropTypes.string,
  intensity: PropTypes.number
});

const AmbientLightMemo = memo(AmbientLight);
AmbientLightMemo.displayName = "AmbientLight";
export default AmbientLightMemo;
