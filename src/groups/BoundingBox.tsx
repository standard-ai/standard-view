// BoundingBox.tsx
import * as React from "react";
import * as THREE from "three";
import exact from "prop-types-exact";
import Group, { GroupProps, GroupPropTypes, generateGroupProps } from "./Group";
import Line, { LineProps, LinePropTypes } from "../primitives/Line";
import { propTypeNumberArrayOfLength } from "../utils/util";
import { EPS } from "../utils/math";

const { useMemo, memo } = React;

interface BoundingBoxProps extends LineProps, GroupProps {
  min?: Array<number>;
  max?: Array<number>;
}

/**
 * BoundingBox
 *
 * In Standard View, BoundingBox is a shape composed with Line primitives.
 * The min and max points are used to determine the bounding box.
 * The position represents the center of the bounding box and based on the
 * min and max the box is scaled to match the min and max corners.
 *
 * If max coordinates are less than or equal to min for any dimension,
 * a small but non-zero scale is used. This seemingly collapses dimensions
 * without incurring uninvertibility and also prevents inverting min and max.
 *
 * @param {BoundingBoxProps} props
 */
const BoundingBox: React.FunctionComponent<
  BoundingBoxProps
> = function BoundingBox(props) {
  const { cleanedProps, groupProps } = generateGroupProps(props);
  // hoverColor for Line has issues because the boundingbox has some bugs
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { min, max, color, hoverColor, children, ...otherProps } = cleanedProps;
  const { position = [0, 0, 0], scale, ...otherGroupProps } = groupProps;

  // Position
  const { _position, disp } = useMemo(
    function updatePositionAndScale() {
      let _min = min;
      let _max = max;
      const _pos = position;

      // Min and Max
      if (_min == null || _max == null) {
        const x = _pos[0];
        const y = _pos[1];
        const z = _pos[2];
        _min = [x - 0.5, y - 0.5, z - 0.5];
        _max = [x + 0.5, y + 0.5, z + 0.5];
      }
      const minVec = new THREE.Vector3(..._min);
      const maxVec = new THREE.Vector3(..._max);
      const displacement = maxVec.clone().sub(minVec);

      // Position
      const center = minVec
        .clone()
        .add(maxVec)
        .multiplyScalar(0.5);
      return { _position: [center.x, center.y, center.z], disp: displacement };
    },
    [position, min, max]
  );

  const _scale = useMemo(
    function updateScale() {
      // Scale
      if (scale) {
        return scale;
      }

      disp.x = Math.max(disp.x, EPS);
      disp.y = Math.max(disp.y, EPS);
      disp.z = Math.max(disp.z, EPS);
      return [disp.x, disp.y, disp.z];
    },
    [scale, disp]
  );

  return (
    <Group
      position={_position}
      scale={_scale}
      color={color}
      {...otherGroupProps}
    >
      <Line start={[-0.5, -0.5, -0.5]} end={[0.5, -0.5, -0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, -0.5, -0.5]} end={[-0.5, 0.5, -0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, -0.5, -0.5]} end={[-0.5, -0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[0.5, -0.5, -0.5]} end={[0.5, 0.5, -0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[0.5, -0.5, -0.5]} end={[0.5, -0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, 0.5, -0.5]} end={[0.5, 0.5, -0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, 0.5, -0.5]} end={[-0.5, 0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, -0.5, 0.5]} end={[0.5, -0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[-0.5, -0.5, 0.5]} end={[-0.5, 0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[0.5, 0.5, 0.5]} end={[-0.5, 0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[0.5, 0.5, 0.5]} end={[0.5, -0.5, 0.5]} {...otherProps}>
        {children}
      </Line>
      <Line start={[0.5, 0.5, 0.5]} end={[0.5, 0.5, -0.5]} {...otherProps}>
        {children}
      </Line>
    </Group>
  );
};

// -----  PropTypes   ----- //
BoundingBox.propTypes = exact({
  min: propTypeNumberArrayOfLength(3),
  max: propTypeNumberArrayOfLength(3),
  ...LinePropTypes,
  ...GroupPropTypes
});

const BoundingBoxMemo = memo(BoundingBox);
BoundingBoxMemo.displayName = "BoundingBox";
export default BoundingBoxMemo;
