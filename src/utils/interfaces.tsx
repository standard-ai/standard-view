// interfaces.tsx
import * as THREE from "three";
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import { propTypeNumberArrayOfLength } from "./util";

export declare namespace StandardViewTypes {
  export type Geometries =
    | THREE.Geometry
    | THREE.BoxBufferGeometry
    | THREE.BufferGeometry
    | THREE.CircleBufferGeometry
    | THREE.CylinderBufferGeometry
    | THREE.PlaneBufferGeometry
    | THREE.TextBufferGeometry
    | THREE.SphereBufferGeometry;
  export type Point = Array<number> | { x: number; y: number; z: number };
}

// export namespace StandardViewPropTypes {
export const Point = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.number),
  PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number
  })
]);

export const GeometryPropTypes = exact({
  position: propTypeNumberArrayOfLength(3),
  scale: propTypeNumberArrayOfLength(3),
  geometry: PropTypes.object, // THREE.Geometry
  rotation: propTypeNumberArrayOfLength(3),
  eulerOrder: PropTypes.oneOf(["XYZ", "XZY", "YXZ", "YZX", "ZXY", "ZYX"]),
  normal: propTypeNumberArrayOfLength(3),
  roll: PropTypes.number,
  up: propTypeNumberArrayOfLength(3),
  quaternion: PropTypes.oneOfType([
    propTypeNumberArrayOfLength(4),
    PropTypes.object // THREE.Quaternion
  ])
});
