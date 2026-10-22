import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    primitive: ReactThreeFiber.Object3DNode<
      THREE.Object3D,
      typeof THREE.Object3D
    >;
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh> & {
      castShadow?: boolean;
      receiveShadow?: boolean;
    };
    geometry: ReactThreeFiber.BufferGeometryNode<
      THREE.BufferGeometry,
      typeof THREE.BufferGeometry
    >;
    lineBasicMaterial: ReactThreeFiber.MaterialNode<
      THREE.LineBasicMaterial,
      typeof THREE.LineBasicMaterial
    >;
    hemisphereLight: ReactThreeFiber.LightNode<
      THREE.HemisphereLight,
      typeof THREE.HemisphereLight
    >;
    ambientLight: ReactThreeFiber.LightNode<
      THREE.AmbientLight,
      typeof THREE.AmbientLight
    >;
    line: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line> & {
      castShadow?: boolean;
      receiveShadow?: boolean;
    };
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    scene: ReactThreeFiber.Object3DNode<THREE.Scene, typeof THREE.Scene>;
    camera: ReactThreeFiber.Object3DNode<THREE.Camera, typeof THREE.Camera>;
    perspectiveCamera: ReactThreeFiber.Object3DNode<
      THREE.PerspectiveCamera,
      typeof THREE.PerspectiveCamera
    >;
    orthographicCamera: ReactThreeFiber.Object3DNode<
      THREE.OrthographicCamera,
      typeof THREE.OrthographicCamera
    >;
    directionalLight: ReactThreeFiber.LightNode<
      THREE.DirectionalLight,
      typeof THREE.DirectionalLight
    >;
    pointLight: ReactThreeFiber.LightNode<
      THREE.PointLight,
      typeof THREE.PointLight
    >;
    spotLight: ReactThreeFiber.LightNode<
      THREE.SpotLight,
      typeof THREE.SpotLight
    >;
    rectAreaLight: ReactThreeFiber.LightNode<
      THREE.RectAreaLight,
      typeof THREE.RectAreaLight
    >;
    meshBasicMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshBasicMaterial,
      typeof THREE.MeshBasicMaterial
    >;
    meshStandardMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshStandardMaterial,
      typeof THREE.MeshStandardMaterial
    >;
    meshPhongMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshPhongMaterial,
      typeof THREE.MeshPhongMaterial
    >;
    meshLambertMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshLambertMaterial,
      typeof THREE.MeshLambertMaterial
    >;
    boxGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.BoxGeometry,
      typeof THREE.BoxGeometry
    >;
    sphereGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.SphereGeometry,
      typeof THREE.SphereGeometry
    >;
    planeGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.PlaneGeometry,
      typeof THREE.PlaneGeometry
    >;
    cylinderGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.CylinderGeometry,
      typeof THREE.CylinderGeometry
    >;
    circleGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.CircleGeometry,
      typeof THREE.CircleGeometry
    >;
    // Add any custom elements here
    groupMember?: any;
    castShadow?: any;
    defaultProps?: any;
  }
}
