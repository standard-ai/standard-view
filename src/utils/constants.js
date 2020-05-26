// constants.js
import * as THREE from "three";

export const Z_AXIS = new THREE.Vector3(0, 0, 1);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);
export const X_AXIS = new THREE.Vector3(1, 0, 0);
export const DEFAULT_UP_VEC3 = Y_AXIS.clone();
export const DEFAULT_NORMAL_VEC3 = Z_AXIS.clone();
export const DEFAULT_RIGHT_VEC3 = X_AXIS.clone();
export const DEFAULT_NORMAL = [0, 0, 1];
export const DEFAULT_UP = [0, 1, 0];
export const DEFAULT_RIGHT = [1, 0, 0];

// Side Types
export const SIDE_TYPES = {
  front: THREE.FrontSide,
  back: THREE.BackSide,
  double: THREE.DoubleSide
};

// Euler Orders
export const EULER_ORDERS = {
  XYZ: "XYZ",
  XZY: "XZY",
  YXZ: "YXZ",
  YZX: "YZX",
  ZXY: "ZXY",
  ZYX: "ZYX"
};

// Control Types
export const CONTROLS_TYPES = {
  ORBIT_CONTROLS: "orbitControls",
  TRACKBALL_CONTROLS: "trackballControls",
  MAP_CONTROLS: "mapControls"
};

export const CAMERA_TYPES = {
  ORTHOGRAPHIC: "orthographic",
  PERSPECTIVE: "perspective"
};

export const SYNONYMOUS_CONTROLS_PROPS = [
  {
    orbitControls: "dampingFactor",
    mapControls: "dampingFactor",
    trackballControls: "dynamicDampingFactor"
  }
];

export const ANTONYMOUS_CONTROLS_PROPS = [
  {
    orbitControls: "enableZoom",
    mapControls: "enableZoom",
    trackballControls: "noZoom"
  },
  {
    orbitControls: "enableRotate",
    mapControls: "enableRotate",
    trackballControls: "noRotate"
  },
  {
    orbitControls: "enablePan",
    mapControls: "enablePan",
    trackballControls: "noPan"
  },
  {
    orbitControls: "enableDamping",
    mapControls: "enableDamping",
    trackballControls: "staticMoving"
  }
];

export const SYNONYMOUS_CAMERA_PROPS = [
  { perspective: "minDistance", orthographic: "minZoom" },
  { perspective: "maxDistance", orthographic: "maxZoom" }
];

// Material Types
export const MATERIAL_TYPES = {
  material: "material",
  basic: "meshBasicMaterial",
  linebasic: "lineBasicMaterial",
  linedashed: "lineDashedMaterial",
  depth: "meshDepthMaterial",
  distance: "meshDistanceMaterial",
  lambert: "meshLambertMaterial",
  matcap: "meshMatcapMaterial",
  normal: "meshNormalMaterial",
  phong: "meshPhongMaterial",
  physical: "meshPhysicalMaterial",
  standard: "meshStandardMaterial",
  toon: "meshToonMaterial",
  points: "pointsMaterial",
  rawshader: "rawShaderMaterial",
  shader: "shaderMaterial",
  shadow: "shadowMaterial",
  sprite: "spriteMaterial"
};

// Simple, Distinct Colors
export const COLORS = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#000000"
];

/**
 * BASE_ANCHORS
 *
 * The ◼'s represent the anchor points.
 *
 *    ◼----◼----◼
 *    |         |
 *    ◼    ◼    ◼
 *    |         |
 *    ◼----◼----◼
 */
export const ANCHORS = {
  "top-left": new THREE.Vector3(-0.5, 0.5, 0),
  top: new THREE.Vector3(0, 0.5, 0),
  "top-right": new THREE.Vector3(0.5, 0.5, 0),
  left: new THREE.Vector3(-0.5, 0, 0),
  center: new THREE.Vector3(0, 0, 0),
  right: new THREE.Vector3(0.5, 0, 0),
  "bottom-left": new THREE.Vector3(-0.5, -0.5, 0),
  bottom: new THREE.Vector3(0, -0.5, 0),
  "bottom-right": new THREE.Vector3(0.5, -0.5, 0)
};

/**
 * ANCHOR_SYNONYMS
 *
 * Synonym map of anchor locations for aligmment positions.
 */
export const ANCHOR_SYNONYMS = {
  "top-left": "top-left",
  "up-left": "top-left",
  "left-top": "top-left",
  "left-up": "top-left",
  top: "top",
  up: "top",
  "top-center": "top",
  "top-middle": "top",
  "up-center": "top",
  "up-middle": "top",
  "center-top": "top",
  "center-up": "top",
  "middle-top": "top",
  "middle-up": "top",
  "top-right": "top-right",
  "up-right": "top-right",
  "right-top": "top-right",
  "right-up": "top-right",
  left: "left",
  "center-left": "left",
  "middle-left": "left",
  "left-center": "left",
  "left-middle": "left",
  center: "center",
  middle: "center",
  right: "right",
  "center-right": "right",
  "middle-right": "right",
  "right-center": "right",
  "right-middle": "right",
  "bottom-left": "bottom-left",
  "down-left": "bottom-left",
  "left-bottom": "bottom-left",
  "left-down": "bottom-left",
  bottom: "bottom",
  down: "bottom",
  "bottom-center": "bottom",
  "bottom-middle": "bottom",
  "down-center": "bottom",
  "down-middle": "bottom",
  "center-bottom": "bottom",
  "center-down": "bottom",
  "middle-bottom": "bottom",
  "middle-down": "bottom",
  "bottom-right": "bottom-right",
  "down-right": "bottom-right",
  "right-bottom": "bottom-right",
  "right-down": "bottom-right"
};
