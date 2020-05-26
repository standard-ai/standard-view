// Circle.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshProps, MeshPropTypes } from "./Mesh";
import { EPS } from "../utils/math";

const { useMemo, memo } = React;

interface CircleProps extends MeshProps {
  radius?: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
}

/**
 * Circle
 *
 * A Circle's radius property is used to scale the Mesh to the desired
 * size. The geometry is constructed with the default radius of 1.
 * The number of segments, however is passed into the geometry's constructor.
 * More segments make the circle look smoother, but also result in more
 * triangles to render.
 *
 * @param {CircleProps} props
 */
const Circle: React.FunctionComponent<CircleProps> = function Circle({
  radius = 1,
  scale,
  segments = 32,
  thetaStart = 0,
  thetaLength = Math.PI * 2,
  side = "double",
  children,
  ...otherProps
}) {
  // Radius
  const _scale = useMemo(
    function updateScale() {
      const r = Math.max(radius, EPS);

      // Zero Radius Warning
      if (r === EPS) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Circle] Zero radius!`);
      }

      return scale || [r, r, 1];
    },
    [scale, radius]
  );

  // Cirle Arguments
  const circleArgs = useMemo(
    function updateCircleArgs() {
      return [
        1, // radius at scale 1
        segments,
        thetaStart,
        thetaLength
      ];
    },
    [segments, thetaStart, thetaLength]
  );

  // Circle Buffer Geometry
  const geometry = useMemo(
    function initGeometry() {
      return new THREE.CircleBufferGeometry(...circleArgs);
    },
    [circleArgs]
  );

  return (
    <Mesh scale={_scale} side={side} geometry={geometry} {...otherProps}>
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Circle.propTypes = exact({
  radius: PropTypes.number,
  segments: PropTypes.number,
  thetaStart: PropTypes.number,
  thetaLength: PropTypes.number,
  side: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ...MeshPropTypes
});

const CircleMemo = memo(Circle);
CircleMemo.displayName = "Circle";
export default CircleMemo;
