// Arrow.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Group from "./Group";
import { MeshProps, MeshPropTypes } from "../primitives/Mesh";
import Cylinder from "../primitives/Cylinder";
import Sphere from "../primitives/Sphere";
import { DEFAULT_NORMAL } from "../utils/constants";
import { propTypeNumberArrayOfLength } from "../utils/util";
import { minmax } from "../utils/math";

const { useMemo, memo } = React;

interface ArrowProps extends MeshProps {
  tail?: Array<number>;
  start?: Array<number>;
  position?: Array<number>;
  head?: Array<number>;
  end?: Array<number>;
  target?: Array<number>;
  normal?: Array<number>;
  magnitude?: number;
  radius?: number;
  shaftRadius?: number;
  headTipRadius?: number;
  headBaseRadius?: number;
  headRatio?: number;
}

/**
 * Arrow
 *
 * In Standard View, Arrow is a Group comprised of two Cylinders and a Sphere.
 * The head of the arrow is Cylinder with different radiusTop and radiusBottom,
 * which scales according to the magnitude of the arrow's length by default.
 * The tail also has a Sphere which also scales according to the magnitude of
 * the shaftRadius.
 * The shaftRadius, headBaseRadius, and headTipRadius may be specifically set.
 * The tail and head may be specified with tail/start/position and
 * head/end/target props.
 * The tail/start/position is also the center of the Sphere at the tail,
 * and head/end/target is the tip of the Cylinder at the head.
 *
 * @param {CapsuleProps} props
 */
const Arrow: React.FunctionComponent<ArrowProps> = function Arrow({
  tail,
  start,
  position = [0, 0, 0],
  head,
  end,
  target,
  radius,
  shaftRadius,
  headBaseRadius,
  headTipRadius = 0,
  headRatio = 0.1,
  normal = DEFAULT_NORMAL,
  magnitude = 1,
  color,
  hoverColor,
  children,
  ...otherProps
}) {
  const { _tail, _head, _headBase, _headRatio, _magnitude } = useMemo(
    function updateTail() {
      // Head and Tail
      /* eslint-disable no-shadow */
      const _tail = tail || start || position;
      let _head = head || end || target;
      /* eslint-enable no-shadow */

      // Compute head and headBase
      const tailVec = new THREE.Vector3(..._tail);
      let arrowVec;
      if (_head != null) {
        // Define Arrow with head/end/target
        arrowVec = new THREE.Vector3(..._head).sub(tailVec);
      } else {
        // Define Arrow with position, normal, and magnitude
        arrowVec = new THREE.Vector3(...normal)
          .normalize()
          .multiplyScalar(magnitude);
      }
      /* eslint-disable no-shadow */
      _head = [arrowVec.x, arrowVec.y, arrowVec.z];
      const _headRatio = minmax(headRatio, 0, 1);
      const headBaseVec = arrowVec.clone().multiplyScalar(1 - _headRatio);
      const _headBase = [headBaseVec.x, headBaseVec.y, headBaseVec.z];
      const _magnitude = arrowVec.length();
      /* eslint-enable no-shadow */

      return { _tail, _head, _headBase, _headRatio, _magnitude };
    },
    [tail, start, position, head, end, target, headRatio, normal, magnitude]
  );

  const _shaftRadius = useMemo(
    function updateShaftRadius() {
      return shaftRadius || radius || 0.02 * _magnitude;
    },
    [shaftRadius, radius, _magnitude]
  );

  const _headBaseRadius = useMemo(
    function updateHeadBaseRadius() {
      return headBaseRadius || _headRatio * _magnitude;
    },
    [headBaseRadius, _headRatio, _magnitude]
  );

  return (
    <Group
      position={_tail}
      color={color}
      hoverColor={hoverColor}
      {...otherProps}
    >
      {/* Tail Sphere */}
      <Sphere radius={_shaftRadius} />
      {/* Shaft */}
      <Cylinder radius={_shaftRadius} start={[0, 0, 0]} end={_headBase} />
      {/* Head */}
      <Cylinder
        start={_headBase}
        end={_head}
        radiusBottom={_headBaseRadius}
        radiusTop={headTipRadius}
      >
        {children}
      </Cylinder>
    </Group>
  );
};

// -----  PropTypes   ----- //
Arrow.propTypes = exact({
  tail: propTypeNumberArrayOfLength(3),
  start: propTypeNumberArrayOfLength(3),
  head: propTypeNumberArrayOfLength(3),
  end: propTypeNumberArrayOfLength(3),
  target: propTypeNumberArrayOfLength(3),
  magnitude: PropTypes.number,
  radius: PropTypes.number,
  shaftRadius: PropTypes.number,
  headBaseRadius: PropTypes.number,
  headTipRadius: PropTypes.number,
  headRatio: PropTypes.number,
  ...MeshPropTypes
});

const ArrowMemo = memo(Arrow);
ArrowMemo.displayName = "Arrow";
export default ArrowMemo;
