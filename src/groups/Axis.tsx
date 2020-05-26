// Axis.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Group, { GroupProps, GroupPropTypes, generateGroupProps } from "./Group";
import Cylinder from "../primitives/Cylinder";
import Sphere from "../primitives/Sphere";
import Text from "../primitives/Text";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useMemo, memo } = React;

interface AxisProps extends GroupProps {
  x?: Array<number>;
  y?: Array<number>;
  z?: Array<number>;
  xColor?: string;
  yColor?: string;
  zColor?: string;
  labelColor?: string;
  xLabel?: string;
  yLabel?: string;
  zLabel?: string;
  labelSize?: number;
  labelHeight?: number;
  thickness?: number;
}

/**
 * Axis
 *
 * Axis of unit length with text labels.
 * By default the axis is along x, y, and z directions.
 * The colors, axis directions, thickness of each axis Cylinder,
 * and label text may be set. The color of each axis and label text
 * may be individually set as well.
 *
 * @param {AxisProps} props
 */
const Axis: React.FunctionComponent<AxisProps> = function Axis(props) {
  const { cleanedProps, groupProps } = generateGroupProps(props);
  const {
    x = [1, 0, 0],
    y = [0, 1, 0],
    z = [0, 0, 1],
    xColor = "red",
    yColor = "blue",
    zColor = "lime",
    labelColor = "gray",
    xLabel = "x",
    yLabel = "y",
    zLabel = "z",
    labelSize = 0.2,
    labelHeight = 0.02,
    thickness = 0.1,
    children,
    ...otherProps
  } = cleanedProps;

  const offsetX = useMemo(
    function updateOffsetX() {
      const axisX = new THREE.Vector3(...x);
      const offX = axisX.multiplyScalar(1.25);
      return [offX.x, offX.y, offX.z];
    },
    [x]
  );

  const offsetY = useMemo(
    function updateOffsetY() {
      const axisY = new THREE.Vector3(...y);
      const offY = axisY.multiplyScalar(1.25);
      return [offY.x, offY.y, offY.z];
    },
    [y]
  );

  const offsetZ = useMemo(
    function updateOffsetZ() {
      const axisZ = new THREE.Vector3(...z);
      const offZ = axisZ.multiplyScalar(1.25);
      return [offZ.x, offZ.y, offZ.z];
    },
    [z]
  );

  return (
    <Group {...groupProps}>
      <Cylinder
        start={[0, 0, 0]}
        end={x}
        color={xColor}
        radius={thickness}
        {...otherProps}
      >
        {children}
      </Cylinder>
      <Sphere position={x} color={xColor} radius={thickness} {...otherProps}>
        {children}
      </Sphere>
      <Cylinder
        start={[0, 0, 0]}
        end={y}
        color={yColor}
        radius={thickness}
        {...otherProps}
      >
        {children}
      </Cylinder>
      <Sphere position={y} color={yColor} radius={thickness} {...otherProps}>
        {children}
      </Sphere>
      <Cylinder
        start={[0, 0, 0]}
        end={z}
        color={zColor}
        radius={thickness}
        {...otherProps}
      >
        {children}
      </Cylinder>
      <Sphere position={z} color={zColor} radius={thickness} {...otherProps}>
        {children}
      </Sphere>
      <Sphere
        position={[0, 0, 0]}
        color="black"
        radius={thickness}
        {...otherProps}
      >
        {children}
      </Sphere>
      <Text
        position={offsetX}
        size={labelSize}
        height={labelHeight}
        text={xLabel}
        color={labelColor}
        billboard
      />
      <Text
        position={offsetY}
        size={labelSize}
        height={labelHeight}
        text={yLabel}
        color={labelColor}
        billboard
      />
      <Text
        position={offsetZ}
        size={labelSize}
        height={labelHeight}
        text={zLabel}
        color={labelColor}
        billboard
      />
    </Group>
  );
};

// -----  PropTypes   ----- //
Axis.propTypes = exact({
  x: propTypeNumberArrayOfLength(3),
  y: propTypeNumberArrayOfLength(3),
  z: propTypeNumberArrayOfLength(3),
  xColor: PropTypes.string,
  yColor: PropTypes.string,
  zColor: PropTypes.string,
  labelColor: PropTypes.string,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  zLabel: PropTypes.string,
  labelSize: PropTypes.number,
  labelHeight: PropTypes.number,
  thickness: PropTypes.number,
  ...GroupPropTypes
});

const AxisMemo = memo(Axis);
AxisMemo.displayName = "Axis";
export default AxisMemo;
