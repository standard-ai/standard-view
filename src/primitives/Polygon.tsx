// Polygon.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";

const { memo } = React;

interface PolygonProps extends MeshProps {
  points?: Array<Array<number>>;
  depth?: number;
}

/**
 * Polygon
 *
 * In Standard View, Polygon actually composes a THREE.ExtrudeBufferGeometry.
 * The points need to be 2d and passed in drawing order.
 * By providing depth, we can create the polygonal prism.
 * Like most other 3D objects, this is also composed with Mesh and so all
 * Mesh properties may be applied.
 *
 * @param {PolygonProps} props
 */
const Polygon: React.FunctionComponent<PolygonProps> = function Polygon({
  points = [[0, 0], [2, 0], [3, 1], [2, 2], [0, 2]],
  depth = 0,
  children,
  ...otherProps
}) {
  const shape = React.useMemo(
    function initShape() {
      /* eslint-disable-next-line no-shadow */
      const shape = new THREE.Shape();

      if (points.length <= 2) return shape;

      // Move to start point
      // @ts-ignore:T2345
      shape.moveTo(...points[0]);
      // Connect points except for start point
      // @ts-ignore:T2345
      points.slice(1).forEach(point => shape.lineTo(...point));

      return shape;
    },
    [points]
  );

  const options = React.useMemo(
    function initOptions() {
      return {
        steps: 1,
        depth,
        bevelEnabled: false
      };
    },
    [depth]
  );

  // Extrude Buffer Geometry
  const geometry = React.useMemo(
    function initGeometry() {
      return new THREE.ExtrudeBufferGeometry(shape, options);
    },
    [shape, options]
  );

  return (
    <Mesh geometry={geometry} {...otherProps}>
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Polygon.propTypes = exact({
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  depth: PropTypes.number,
  ...MeshPropTypes
});

const PolygonMemo = memo(Polygon);
PolygonMemo.displayName = "Polygon";
export default PolygonMemo;
