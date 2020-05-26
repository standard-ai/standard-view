// Quad.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { MeshProps, MeshPropTypes } from "./Mesh";
import Triangle from "./Triangle";
import { EPS_NANO } from "../utils/math";

const { useEffect, useMemo, memo } = React;

interface QuadProps extends MeshProps {
  points?: Array<Array<number>>;
  indices?: Array<Array<number>>;
  coplanarThreshold?: number;
}

/**
 * Quad
 *
 * In Standard View, Quad is actually composed with a Triangle,
 * employing THREE.BufferGeometry underneath. Unlike Triangle,
 * which can take an arbitrary number of vertices, Quad is
 * limited to exactly 4.
 *
 * @param {QuadProps} props
 */
const Quad: React.FunctionComponent<QuadProps> = function Quad({
  points = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]],
  indices = [[0, 1, 2], [2, 3, 0]],
  coplanarThreshold = EPS_NANO,
  side = "double",
  children,
  ...otherProps
}) {
  // Points
  const _points = useMemo(
    function updatePoints() {
      // Default Points
      let p = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];

      // Valid points
      if (Array.isArray(points)) {
        p = points;
      }

      // Exactly 4 Points
      if (p.length > 4) {
        // Too Many Points
        p = p.slice(0, 4);
      } else if (p.length < 4) {
        // Too Few Points
        while (p.length < 4) {
          p.push([0, 0, 0]);
        }
      }

      return p;
    },
    [points]
  );

  // Indices
  const _indices = useMemo(
    function updateIndices() {
      // Default Indices
      let ind = [[0, 1, 2], [2, 3, 0]];

      // Valid indices
      if (Array.isArray(indices) && indices.length === 2) {
        ind = indices;
      }

      return ind;
    },
    [indices]
  );

  // Planarity
  useEffect(
    function checkPlanarity() {
      const p0 = new THREE.Vector3(..._points[0]);
      const p1 = new THREE.Vector3(..._points[1]);
      const p2 = new THREE.Vector3(..._points[2]);
      const p3 = new THREE.Vector3(..._points[3]);
      const p01 = p1.clone().sub(p0);
      const p02 = p2.clone().sub(p0);
      const p03 = p3.clone().sub(p0);
      const p01x02 = p01
        .clone()
        .cross(p02)
        .normalize();
      const p01x03 = p01
        .clone()
        .cross(p03)
        .normalize();
      if (Math.abs(p01x02.dot(p01x03)) < 1 - coplanarThreshold) {
        /* eslint-disable-next-line no-console */
        console.warn("[Quad] Points are not co-planar!");
      }
    },
    [_points, coplanarThreshold]
  );

  return (
    <Triangle points={_points} indices={_indices} side={side} {...otherProps}>
      {children}
    </Triangle>
  );
};

// -----  PropTypes   ----- //
Quad.propTypes = exact({
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  indices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  coplanarThreshold: PropTypes.number,
  ...MeshPropTypes
});

const QuadMemo = memo(Quad);
QuadMemo.displayName = "Quad";
export default QuadMemo;
