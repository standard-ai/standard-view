// fbx.tsx
import React from 'react';
import * as THREE from 'three';

// standard-view
import {
  View3D,
  FBX,
  AmbientLight,
  SpotLight,
  DirectionalLight,
} from '../../src';
import { DEFAULT_NORMAL } from '../../src/utils/constants';
import { STORY_STYLE } from '../utils/common';

function FBXStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = false,
    fbxURL = 'sophia.fbx',
    fbxPath = 'fbx/',
    position = [0, -150, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    actionIndex = 0,
    visible = true,
    hoverColor = 'yellow',
  } = args || {};

  // sophia.fbx declares a Z-up axis, so three.js 0.184's FBXLoader rotates it
  // -90° about X on load; its mesh data is already Y-up, so cancel that here.
  // samba.fbx (Y-up) needs nothing.
  const calculatedRotation =
    fbxURL === 'sophia.fbx' ? [Math.PI / 2, 0, 0] : rotation;

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, 20, 50],
        far: 10000,
      }}
      backgroundEquirectangularTextureURL="backgrounds/store.jpg"
      orbitControls
      style={STORY_STYLE}
      controls={{ autoRotate, enableZoom: false }}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      {/* Lights */}
      <SpotLight intensity={200} color="cyan" position={[0, 100, 100]} />
      <SpotLight intensity={100} color="cyan" position={[0, 100, -100]} />
      <SpotLight intensity={200} color="snow" position={[0, 100, 100]} />
      <SpotLight intensity={100} color="snow" position={[0, 100, -100]} />
      <SpotLight intensity={150} color="tan" position={[0, 100, -100]} />
      <SpotLight intensity={150} color="tan" position={[0, 100, 100]} />
      <DirectionalLight intensity={5} position={[0, 1, 0]} />
      <AmbientLight intensity={2} />

      {/* FBX */}
      <FBX
        position={position}
        scale={scale}
        rotation={calculatedRotation}
        normal={normal}
        roll={roll}
        fbxURL={fbxURL}
        fbxPath={fbxPath}
        actionIndex={actionIndex}
        visible={visible}
        hoverColor={hoverColor}
      />
    </View3D>
  );
}

FBXStory.args = {
  autoRotate: false,
  fbxURL: 'sophia.fbx',
  fbxPath: 'fbx/',
  position: [0, -150, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  actionIndex: 0,
  visible: true,
  hoverColor: 'yellow',
};

FBXStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: false,
  },
  fbxURL: {
    control: { type: 'select' },
    options: ['sophia.fbx', 'samba.fbx'],
    description: 'FBX model URL',
    defaultValue: 'sophia.fbx',
  },
  fbxPath: {
    control: { type: 'text' },
    description: 'FBX model path',
    defaultValue: 'fbx/',
  },
  position: {
    control: { type: 'object' },
    description: 'Model position',
    defaultValue: [0, -150, 0],
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
    description: 'Model normal',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  actionIndex: {
    control: { type: 'number', min: 0, max: 10, step: 1 },
    description: 'Animation action index',
    defaultValue: 0,
  },
  visible: {
    control: { type: 'boolean' },
    description: 'Model visibility',
    defaultValue: true,
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Tint applied to the model while the pointer is over it',
    defaultValue: 'yellow',
  },
};

FBXStory.storyName = 'FBX';

export default FBXStory;
