// interfaces.tsx
import * as THREE from "three";

export declare namespace StandardViewTypes {
  export type Geometries =
    | THREE.BufferGeometry
    | THREE.BoxGeometry
    | THREE.CircleGeometry
    | THREE.CylinderGeometry
    | THREE.PlaneGeometry
    | THREE.SphereGeometry
    | THREE.EdgesGeometry;
  export type Point = Array<number> | { x: number; y: number; z: number };
}
