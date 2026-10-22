// AmbientalLight.tsx
import * as React from "react";
import * as THREE from "three";

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

  return (
    // @ts-ignore: Property 'ambientLight' does not exist on type 'JSX.IntrinsicElements'
    <ambientLight color={_color} intensity={intensity} {...otherProps} />
  );
};

const AmbientLightMemo = memo(AmbientLight);
AmbientLightMemo.displayName = "AmbientLight";
export default AmbientLightMemo;
