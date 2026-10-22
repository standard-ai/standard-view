// gltf.tsx
import React from 'react';
import * as THREE from 'three';

// standard-view
import { View3D, GLTF, AmbientLight, SpotLight } from '../../src';
import { DEFAULT_NORMAL } from '../../src/utils/constants';
import { STORY_STYLE } from '../utils/common';

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
  } = args || {};

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, -100, 1100],
        target: [0, -100, 0],
        up: [0, 1, 0],
        far: 10000,
      }}
      orbitControls
      style={STORY_STYLE}
      controls={{ autoRotate }}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      {/* Lights */}
      <AmbientLight intensity={ambientIntensity} />
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
};

GLTFStory.storyName = 'GLTF';

export default GLTFStory;
