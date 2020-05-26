// HemispherealLight.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Sphere from "../primitives/Sphere";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useMemo, memo } = React;

interface HemispherealLightHelperProps {
  helperSize: number;
  color: string | THREE.Color;
  groundColor: string;
}

/**
 * HemisphereLightHelper
 *
 * react-three-fiber's reconciler switchInstance function for re-rendering
 * components with new arguments, the order of execution is removeChild,
 * recursiveRemove, dispose, and delete. Since children are removed before
 * disposing a three.js object, if the dispose function references the
 * children, an array reference crash occurs.
 *
 * HemisphereLightHelper's dispose function calls:
 *    this.children[0].geometry.dispose();
 *    this.children[0].material.dispose();
 * where this.children[0] is refering to the Octahedron that represents the
 * hemisphere light. Unfortunatley, three.js's poor choice of array
 * referencing and react-three-fiber's order of component removal causes
 * an array reference crash (since the children were recursively removed,
 * and only an empty array exists at the HemisphereLightHelper's dispose call).
 *
 * See RectAreaLight.js for more details, since the same issue exists for
 * that light helper too.
 *
 * Ultimately, THREE.HemisphereLightHelper / hemisphereLightHelper cannot
 * safely re-render through react-three-fiber's reconciler.
 *
 * This is the custom HemisphereLightHelper.
 */
function HemisphereLightHelper({
  helperSize,
  color,
  groundColor
}): React.ClassicElement<HemispherealLightHelperProps> {
  return (
    <>
      <Sphere
        radius={helperSize}
        widthSegments={10}
        heightSegments={10}
        thetaStart={0}
        thetaLength={Math.PI * 0.5}
        color={color}
        wireframe
      />
      <Sphere
        radius={helperSize}
        widthSegments={10}
        heightSegments={10}
        thetaStart={Math.PI * 0.5}
        thetaLength={Math.PI}
        color={groundColor}
        wireframe
      />
    </>
  );
}

HemisphereLightHelper.propTypes = exact({
  helperSize: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  groundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
});

interface HemisphereLightProps {
  position?: Array<number>;
  color?: string;
  skyColor?: string;
  groundColor?: string;
  intensity?: number;
  helper?: boolean;
  helperSize?: number;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  children?: any;
}

const HemisphereLight: React.FunctionComponent<
  HemisphereLightProps
> = function HemisphereLight({
  position = [0, 10, 0],
  color = "lightskyblue",
  groundColor = "sandybrown",
  intensity = 1,
  helper = false,
  helperSize = 1,
  skyColor,
  ...otherProps
}) {
  const _color = useMemo(
    function updatedColor() {
      return new THREE.Color(skyColor || color);
    },
    [color, skyColor]
  );

  const _groundColor = useMemo(
    function updateGroundColor() {
      return new THREE.Color(groundColor);
    },
    [groundColor]
  );

  const helperProps = useMemo(
    function updateHelperProps() {
      return {
        helperSize,
        color: _color,
        groundColor: _groundColor
      };
    },
    [helperSize, _color, _groundColor]
  );

  return (
    <hemisphereLight
      color={_color}
      groundColor={_groundColor}
      position={position as [number, number, number]}
      intensity={intensity}
      {...otherProps}
    >
      {helper && <HemisphereLightHelper {...helperProps} />}
    </hemisphereLight>
  );
};

// -----  PropTypes   ----- //
HemisphereLight.propTypes = exact({
  position: propTypeNumberArrayOfLength(3),
  color: PropTypes.string,
  skyColor: PropTypes.string,
  groundColor: PropTypes.string,
  intensity: PropTypes.number,
  helper: PropTypes.bool,
  helperSize: PropTypes.number
});

const HemisphereLightMemo = memo(HemisphereLight);
HemisphereLightMemo.displayName = "HemisphereLight";
export default HemisphereLightMemo;
