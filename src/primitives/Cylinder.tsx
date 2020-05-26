// Cylinder.tsx
import * as React from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import Mesh, { MeshPropTypes, MeshProps } from "./Mesh";
import { Y_AXIS } from "../utils/constants";
import { EPS } from "../utils/math";
import { propTypeNumberArrayOfLength } from "../utils/util";

const { useMemo, memo } = React;

interface CylinderProps extends MeshProps {
  start?: Array<number>;
  end?: Array<number>;
  radius?: number;
  height?: number;
  radiusTop?: number;
  radiusBottom?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
}

/**
 * Cylinder
 *
 * A Cylinder's start and end points are used to determine the height,
 * and rotation of the mesh to represent a cylinder along the start to end
 * vector. The radius is used to scale the mesh for the appropriate thickness.
 * Cylinder's may also have radiusBottom and radiusTop which correspond to the
 * start and end faces respectively. The scale parameter takes least priority if
 * start, end, and radius are provided.
 *
 * @param {CylinderProps} props
 */
const Cylinder: React.FunctionComponent<CylinderProps> = function Cylinder({
  position,
  start,
  end,
  quaternion,
  rotation, // If no start, end, quaternion, then rotation gets set in Mesh
  scale = [1, 1, 1],
  radius,
  radiusTop = 1,
  radiusBottom = 1,
  height,
  radialSegments = 32,
  heightSegments = 1,
  openEnded = false,
  children,
  ...otherProps
}) {
  // Start and End Determine Position (Center), Quaternion, and Height of Cylinder
  const { dispVec, _position } = useMemo(
    function updateDispAndPosition() {
      let _start = start;
      let _end = end;

      // Generate Start and End if not provided
      if (_start == null || _end == null) {
        if (position) {
          _start = [position[0], position[1] - 0.5, position[2]];
          _end = [position[0], position[1] + 0.5, position[2]];
        } else {
          _start = [0, -0.5, 0];
          _end = [0, 0.5, 0];
        }
      }

      const startV = new THREE.Vector3(..._start);
      const endV = new THREE.Vector3(..._end);

      // Displacement
      const dispV = endV.clone().sub(startV);

      // Center is at the mid-point between start and end
      const posVec = startV
        .clone()
        .add(endV)
        .multiplyScalar(0.5);

      return { dispVec: dispV, _position: [posVec.x, posVec.y, posVec.z] };
    },
    [start, end, position]
  );

  // Quaternion
  const _quaternion = useMemo(
    function updateQuaternion() {
      if (quaternion) {
        return quaternion;
      }

      // Cylinder's rotation should line up along start to end direction
      // by default the cylinder is parallel to y-axis
      const normal = dispVec.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, normal);

      // Apply additional rotation
      if (rotation) {
        const rot = new THREE.Quaternion().setFromEuler(
          // @ts-ignore:T2345 // spread
          new THREE.Euler(...rotation, "XYZ")
        );
        q.premultiply(rot);
      }

      return q;
    },
    [dispVec, quaternion, rotation]
  );

  // Scale
  const _scale = useMemo(
    function updateScale() {
      let s = scale;
      if (!Array.isArray(scale) || scale.length !== 3) {
        /* eslint-disable-next-line no-console */
        console.warn(
          `[Cylinder] scale must be a 3x1 array of numbers! scale: ${scale}`
        );

        s = [1, 1, 1];
      }

      // Scale Cylinder height to match distance between start and end
      s[1] = Math.max(dispVec.length(), EPS);

      // Scale Cylinder to match height
      if (height != null) {
        s[1] = Math.max(height, EPS);
      }

      // Scale Cylinder to match radius
      if (radius != null) {
        const r = Math.max(radius, EPS);
        s[0] = r;
        s[2] = r;
      }

      // Zero Radius Warning
      if (s[0] <= EPS && s[2] <= EPS) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Cylinder] Zero radius!`);
      }

      // Zero Height Warning
      if (s[1] <= EPS) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Cylinder] Zero height!`);
      }

      return s;
    },
    [dispVec, scale, radius, height]
  );

  // Cylinder Arguments
  const cylinderArgs = useMemo(
    function updateCylinderArgs() {
      // Zero Radius Warning
      if (radiusTop <= EPS && radiusBottom <= EPS) {
        /* eslint-disable-next-line no-console */
        console.warn(`[Cylinder] Both top and bottom radius are zero!`);
      }

      return [
        radiusTop,
        radiusBottom,
        1, // height at scale 1
        radialSegments,
        heightSegments,
        openEnded
      ];
    },
    [radiusTop, radiusBottom, radialSegments, heightSegments, openEnded]
  );

  // Cylinder Buffer Geometry
  const geometry = useMemo(
    function initGeometry() {
      // @ts-ignore:T2345 // spread
      return new THREE.CylinderBufferGeometry(...cylinderArgs);
    },
    [cylinderArgs]
  );

  return (
    <Mesh
      position={_position}
      scale={_scale}
      quaternion={_quaternion}
      rotation={rotation}
      geometry={geometry}
      {...otherProps}
    >
      {children}
    </Mesh>
  );
};

// -----  PropTypes   ----- //
Cylinder.propTypes = exact({
  start: propTypeNumberArrayOfLength(3),
  end: propTypeNumberArrayOfLength(3),
  radius: PropTypes.number,
  radiusTop: PropTypes.number,
  radiusBottom: PropTypes.number,
  height: PropTypes.number,
  radialSegments: PropTypes.number,
  heightSegments: PropTypes.number,
  openEnded: PropTypes.bool,
  ...MeshPropTypes
});

const CylinderMemo = memo(Cylinder);
CylinderMemo.displayName = "Cylinder";
export default CylinderMemo;
