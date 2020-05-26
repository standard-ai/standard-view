// Capsule.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Group, { generateGroupProps } from "./Group";
import { MeshProps, MeshPropTypes } from "../primitives/Mesh";
import Sphere from "../primitives/Sphere";
import Cylinder from "../primitives/Cylinder";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useMemo, memo } = React;

interface CapsuleProps extends MeshProps {
  start?: Array<number>;
  end?: Array<number>;
  radius?: number;
}

/**
 * Capsule
 *
 * In Standard View, Capsule is a Group comprised of two Spheres and a Cylinder.
 * The Sphere and Cylinder all have the same radius, radiusTop, and radiusBottom.
 * The geometries are constructed with unit radii but these primitives are scaled
 * according to the provided radius property. The start and end properties determine
 * the centers of the bottom and top Spheres and also the start and end of the
 * Cylinder.
 * The position, scale, rotation, quaternion, and other Group properties are extracted
 * and applied to the group.
 *
 * @param {CapsuleProps} props
 */
const Capsule: React.FunctionComponent<CapsuleProps> = function Capsule(props) {
  const { cleanedProps, groupProps } = generateGroupProps(props);
  const {
    start,
    end,
    radius,
    color,
    hoverColor,
    children,
    ...otherProps
  } = cleanedProps;
  const _position = groupProps.position;

  const { startNorm, endNorm, centerVec } = useMemo(
    function updateStartAndEnd() {
      let _start = start;
      let _end = end;

      // Generate Start and End if not provided
      if (_start == null || _end == null) {
        if (_position) {
          _start = [_position[0], _position[1] - 0.5, _position[2]];
          _end = [_position[0], _position[1] + 0.5, _position[2]];
        } else {
          _start = [0, -0.5, 0];
          _end = [0, 0.5, 0];
        }
      }

      // Normalize start and end around center
      // Let Group manage the position
      const startVec = new THREE.Vector3(..._start);
      const endVec = new THREE.Vector3(..._end);
      const center = startVec
        .clone()
        .add(endVec)
        .multiplyScalar(0.5);
      // Normalize around center
      startVec.sub(center);
      endVec.sub(center);
      // Vector to Array
      const startN = [startVec.x, startVec.y, startVec.z];
      const endN = [endVec.x, endVec.y, endVec.z];
      return { startNorm: startN, endNorm: endN, centerVec: center };
    },
    [start, end, _position]
  );

  groupProps.position = [centerVec.x, centerVec.y, centerVec.z];

  const _radius = useMemo(
    function updateRadius() {
      return radius || 1;
    },
    [radius]
  );

  return (
    <Group color={color} hoverColor={hoverColor} {...groupProps}>
      <Sphere radius={_radius} position={startNorm} {...otherProps}>
        {children}
      </Sphere>
      <Cylinder
        radius={_radius}
        start={startNorm}
        end={endNorm}
        {...otherProps}
      >
        {children}
      </Cylinder>
      <Sphere position={endNorm} radius={_radius} {...otherProps}>
        {children}
      </Sphere>
    </Group>
  );
};

// -----  PropTypes   ----- //
Capsule.propTypes = exact({
  start: propTypeNumberArrayOfLength(3),
  end: propTypeNumberArrayOfLength(3),
  radius: PropTypes.number,
  ...MeshPropTypes
});

const CapsuleMemo = memo(Capsule);
CapsuleMemo.displayName = "Capsule";
export default CapsuleMemo;
