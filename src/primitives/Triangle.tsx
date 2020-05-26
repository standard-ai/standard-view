// Triangle.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";

const { useRef, useEffect, memo } = React;

interface TriangleProps extends MeshProps {
  points?: Array<Array<number>>;
  indices?: Array<Array<number>>;
}

/**
 * Triangle
 *
 * In Standard View, Triangle actually composes a THREE.BufferGeometry.
 * By default the indices assume the order of the points passed in,
 * however, particular indices may also be provided. The BufferGeometry
 * can also handle more than 3 vertices and virtually any polygon may be
 * constructed by providing all the vertices and sets of triangle indices.
 * Like most other 3D objects, this is also composed with Mesh and so all
 * Mesh properties may be applied.
 *
 * @param {TriangleProps} props
 */
const Triangle: React.FunctionComponent<TriangleProps> = function Triangle({
  points = [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
  indices = [[0, 1, 2]],
  side = "double",
  children,
  ...otherProps
}) {
  // Buffer Geometry of Triangles
  const geometry = useRef(new THREE.BufferGeometry());

  useEffect(
    function updateVertices() {
      const vertices = [];
      // @ts-ignore:T2345 // spread
      points.map(point => vertices.push(...point));

      // Remove Old Points
      geometry.current.deleteAttribute("position");
      // Add New Points
      geometry.current.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(vertices), 3)
      );
    },
    [geometry, points]
  );

  // Indices are triplets indicating the index of vertices
  // that make a triangle.
  // Format Indices into One Array of [t1,t1,t1, t2,t2,t2 ...]
  useEffect(
    function updateIndices() {
      const _indices = [];
      // @ts-ignore:T2345 // spread
      indices.map(triangle => _indices.push(...triangle));

      // Replace Indices
      geometry.current.setIndex(
        new THREE.BufferAttribute(new Uint32Array(_indices), 1)
      );
    },
    [geometry, indices]
  );

  return (
    <Mesh geometry={geometry.current} side={side} {...otherProps}>
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Triangle.propTypes = exact({
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  indices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  ...MeshPropTypes
});

const TriangleMemo = memo(Triangle);
TriangleMemo.displayName = "Triangle";
export default TriangleMemo;
