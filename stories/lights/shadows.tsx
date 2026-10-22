// shadows.tsx
import React from 'react';
import * as THREE from 'three';

// standard-view
import {
  View3D,
  PointLight,
  AmbientLight,
  Sphere,
  Box,
  Cylinder,
  GLTF,
} from '../../src';
import { spin, spinY, Ground, STORY_STYLE } from '../utils/common';

function ShadowStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = false,
    shadowMapEnabled = true,
    shadowType = 'pcf',
    flamingoCastShadow = true,
    flamingoReceiveShadow = true,
    helmetCastShadow = true,
    helmetReceiveShadow = true,
    redDiskCastShadow = true,
    redDiskReceiveShadow = true,
    goldBarCastShadow = true,
    goldBarReceiveShadow = true,
    light1CastShadow = true,
    light1ShadowMapWidth = 2048,
    light1ShadowMapHeight = 2048,
    light2CastShadow = true,
    light2ShadowMapWidth = 2048,
    light2ShadowMapHeight = 2048,
    ambientLightIntensity = 0.2,
  } = args || {};

  return (
    <View3D
      backgroundColor="black"
      orbitControls
      camera={{ position: [0, 4, 6] }}
      shadowMapEnabled={shadowMapEnabled}
      shadowType={shadowType}
      style={STORY_STYLE}
      controls={{ autoRotate }}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      <Sphere
        position={[-4, 1.25, 1]}
        radius={1.5}
        color="white"
        materialType="phong"
        castShadow
        receiveShadow
      />
      <GLTF
        position={[2.5, 2.5, 1]}
        scale={[0.01, 0.01, 0.01]}
        gltfPath="gltf/"
        gltfURL="flamingo.glb"
        dracoDecoderPath="gltf/draco-decoders/"
        castShadow={flamingoCastShadow}
        receiveShadow={flamingoReceiveShadow}
        animation={spin}
      />
      <GLTF
        position={[-1, 2.75, 0.25]}
        scale={[0.7, 0.7, 0.7]}
        gltfPath="gltf/damaged-helmet/"
        gltfURL="DamagedHelmet.gltf"
        castShadow={helmetCastShadow}
        receiveShadow={helmetReceiveShadow}
        animation={spinY}
      />
      <Ground
        rotation={[-Math.PI * 0.5, 0, 0]}
        materialType="phong"
        color="white"
      />
      <Cylinder
        start={[9, 0, -1]}
        end={[9, 3, -1]}
        radius={1.5}
        materialType="physical"
        opacity={0.5}
        color="cyan"
        castShadow
        receiveShadow
      />
      <Cylinder
        start={[2, 0, 3]}
        end={[2, 0.5, 3]}
        radius={2.5}
        materialType="phong"
        color="red"
        castShadow={redDiskCastShadow}
        receiveShadow={redDiskReceiveShadow}
      />
      <Box
        position={[2, 1.3, 2]}
        scale={[4, 0.6, 0.6]}
        materialType="standard"
        color="yellow"
        castShadow={goldBarCastShadow}
        receiveShadow={goldBarReceiveShadow}
      />

      {/* Lights */}
      <PointLight
        position={[3, 4, -1]}
        color="white"
        intensity={8}
        decay={0.8}
        castShadow={light1CastShadow}
        shadowMapWidth={light1ShadowMapWidth}
        shadowMapHeight={light1ShadowMapHeight}
        helper
      />
      <PointLight
        position={[-6, 4, 1.5]}
        color="white"
        intensity={8}
        decay={0.8}
        castShadow={light2CastShadow}
        shadowMapWidth={light2ShadowMapWidth}
        shadowMapHeight={light2ShadowMapHeight}
        helper
      />
      <AmbientLight intensity={ambientLightIntensity} />
    </View3D>
  );
}

ShadowStory.args = {
  autoRotate: false,
  shadowMapEnabled: true,
  shadowType: 'pcf',
  flamingoCastShadow: true,
  flamingoReceiveShadow: true,
  helmetCastShadow: true,
  helmetReceiveShadow: true,
  redDiskCastShadow: true,
  redDiskReceiveShadow: true,
  goldBarCastShadow: true,
  goldBarReceiveShadow: true,
  light1CastShadow: true,
  light1ShadowMapWidth: 2048,
  light1ShadowMapHeight: 2048,
  light2CastShadow: true,
  light2ShadowMapWidth: 2048,
  light2ShadowMapHeight: 2048,
  ambientLightIntensity: 0.5,
};

ShadowStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: false,
  },
  shadowMapEnabled: {
    control: { type: 'boolean' },
    description: 'Enable shadow mapping',
    defaultValue: true,
  },
  shadowType: {
    control: { type: 'select' },
    options: ['basic', 'pcf'],
    description: 'Shadow type (pcfsoft is accepted as an alias of pcf)',
    defaultValue: 'pcf',
  },
  flamingoCastShadow: {
    control: { type: 'boolean' },
    description: 'Flamingo cast shadow',
    defaultValue: true,
  },
  flamingoReceiveShadow: {
    control: { type: 'boolean' },
    description: 'Flamingo receive shadow',
    defaultValue: true,
  },
  helmetCastShadow: {
    control: { type: 'boolean' },
    description: 'Helmet cast shadow',
    defaultValue: true,
  },
  helmetReceiveShadow: {
    control: { type: 'boolean' },
    description: 'Helmet receive shadow',
    defaultValue: true,
  },
  redDiskCastShadow: {
    control: { type: 'boolean' },
    description: 'Red disk cast shadow',
    defaultValue: true,
  },
  redDiskReceiveShadow: {
    control: { type: 'boolean' },
    description: 'Red disk receive shadow',
    defaultValue: true,
  },
  goldBarCastShadow: {
    control: { type: 'boolean' },
    description: 'Gold bar cast shadow',
    defaultValue: true,
  },
  goldBarReceiveShadow: {
    control: { type: 'boolean' },
    description: 'Gold bar receive shadow',
    defaultValue: true,
  },
  light1CastShadow: {
    control: { type: 'boolean' },
    description: 'Light 1 cast shadow',
    defaultValue: true,
  },
  light1ShadowMapWidth: {
    control: { type: 'number', min: 512, max: 4096, step: 512 },
    description: 'Light 1 shadow map width',
    defaultValue: 2048,
  },
  light1ShadowMapHeight: {
    control: { type: 'number', min: 512, max: 4096, step: 512 },
    description: 'Light 1 shadow map height',
    defaultValue: 2048,
  },
  light2CastShadow: {
    control: { type: 'boolean' },
    description: 'Light 2 cast shadow',
    defaultValue: true,
  },
  light2ShadowMapWidth: {
    control: { type: 'number', min: 512, max: 4096, step: 512 },
    description: 'Light 2 shadow map width',
    defaultValue: 2048,
  },
  light2ShadowMapHeight: {
    control: { type: 'number', min: 512, max: 4096, step: 512 },
    description: 'Light 2 shadow map height',
    defaultValue: 2048,
  },
  ambientLightIntensity: {
    control: { type: 'number', min: 0, max: 5, step: 0.1 },
    description: 'Ambient light intensity',
    defaultValue: 0.5,
  },
};

export default ShadowStory;
