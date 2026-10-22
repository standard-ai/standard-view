// gltf.tsx
import React, { useCallback, useState } from 'react';
import * as THREE from 'three';

// standard-view
import {
  View3D,
  GLTF,
  AmbientLight,
  DirectionalLight,
  SpotLight,
} from '../../src';
import { DEFAULT_NORMAL } from '../../src/utils/constants';
import { STORY_STYLE } from '../utils/common';

// The camera tuned for the bundled city model (tokyo.glb); any other model is
// framed from its bounding sphere once it has loaded, unless fitCamera is off.
const DEFAULT_CAMERA = {
  fov: 45,
  position: [0, -100, 1100],
  target: [0, -100, 0],
  up: [0, 1, 0],
  far: 10000,
};

function fitCameraTo(scene: THREE.Object3D): any {
  const sphere = new THREE.Box3()
    .setFromObject(scene)
    .getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 1e-3);
  // Distance at which a sphere of this radius fills the vertical field of view, plus margin.
  const distance =
    (radius / Math.sin((DEFAULT_CAMERA.fov / 2) * (Math.PI / 180))) * 1.2;
  const { x, y, z } = sphere.center;
  return {
    fov: DEFAULT_CAMERA.fov,
    position: [x, y + radius * 0.3, z + distance],
    target: [x, y, z],
    up: [0, 1, 0],
    near: distance / 100,
    far: distance * 100,
  };
}

function GLTFStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    gltfPath = 'gltf/',
    gltfURL = 'tokyo.glb',
    dracoDecoderPath = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/',
    materialType = 'lambert',
    castShadow = true,
    receiveShadow = true,
    visible = true,
    ambientIntensity = 2,
    hoverColor = 'yellow',
    fitCamera = true,
  } = args || {};

  // Camera framing, recomputed whenever a model finishes loading
  const [fitted, setFitted] = useState<any>(null);
  const onLoad = useCallback((gltf: any): void => {
    setFitted(fitCameraTo(gltf.scene));
  }, []);
  const camera = fitCamera && fitted ? fitted : DEFAULT_CAMERA;

  return (
    <View3D
      camera={camera}
      orbitControls
      style={STORY_STYLE}
      controls={{ autoRotate }}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      {/* Lights */}
      <AmbientLight intensity={ambientIntensity} />
      {/* A directional light has no distance falloff, so a model of any size is lit */}
      <DirectionalLight intensity={2} position={[1, 2, 1]} />
      <SpotLight
        position={[200, 900, 200]}
        distance={10000}
        intensity={1000}
        castShadow
        shadowAutoUpdate
      />

      {/* GLTF */}
      <GLTF
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
        gltfPath={gltfPath}
        gltfURL={gltfURL}
        dracoDecoderPath={dracoDecoderPath}
        materialType={materialType}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        visible={visible}
        hoverColor={hoverColor}
        onLoad={onLoad}
      />
    </View3D>
  );
}

GLTFStory.args = {
  autoRotate: true,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  gltfPath: 'gltf/',
  gltfURL: 'tokyo.glb',
  dracoDecoderPath:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/',
  materialType: 'lambert',
  castShadow: true,
  receiveShadow: true,
  visible: true,
  ambientIntensity: 2,
  hoverColor: 'yellow',
  fitCamera: true,
};

GLTFStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  position: {
    control: { type: 'object' },
    description: 'Model position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Model scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Model rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Normal vector',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  gltfPath: {
    control: {
      type: 'select',
      labels: { '': 'none (gltfURL is the full URL)' },
    },
    options: ['gltf/', 'https://threejs.org/examples/models/gltf/', ''],
    description:
      'Path prefixed to gltfURL; pick none to give the full URL in gltfURL',
    defaultValue: 'gltf/',
  },
  gltfURL: {
    control: { type: 'text' },
    description: 'GLTF file URL',
    defaultValue: 'tokyo.glb',
  },
  dracoDecoderPath: {
    control: { type: 'text' },
    description: 'Draco decoder path',
    defaultValue:
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/libs/draco/',
  },
  materialType: {
    control: { type: 'select' },
    options: ['basic', 'lambert', 'phong', 'physical', 'standard'],
    description: 'Material type',
    defaultValue: 'lambert',
  },
  castShadow: {
    control: { type: 'boolean' },
    description: 'Cast shadows',
    defaultValue: true,
  },
  receiveShadow: {
    control: { type: 'boolean' },
    description: 'Receive shadows',
    defaultValue: true,
  },
  visible: {
    control: { type: 'boolean' },
    description: 'Model visibility',
    defaultValue: true,
  },
  ambientIntensity: {
    control: { type: 'number', min: 0, max: 5, step: 1 },
    description: 'Ambient light intensity',
    defaultValue: 2,
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Tint applied to the model while the pointer is over it',
    defaultValue: 'yellow',
  },
  fitCamera: {
    control: { type: 'boolean' },
    description:
      'Frame the loaded model from its bounding sphere (off: the fixed camera tuned for tokyo.glb)',
    defaultValue: true,
  },
};

GLTFStory.storyName = 'GLTF';

export default GLTFStory;
