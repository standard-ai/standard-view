// view3D-envmap.tsx
import React from 'react';

// standard-view
import * as THREE from 'three';
import { View3D } from '../../src';
import { Balls, Light, view3DProps } from '../utils/common';

function View3DEnvMapStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    background = 'backgrounds/overpass.hdr',
    view3DEnvMap = true,
    roughness = 0,
    metalness = 0.5,
    reflectivity = 0.5,
    lights = true,
  } = args || {};

  const RGBE = background === 'backgrounds/overpass.hdr';

  return (
    <View3D
      {...view3DProps}
      controls={{ autoRotate }}
      backgroundEquirectangularRGBEURL={RGBE ? background : undefined}
      backgroundEquirectangularTextureURL={background}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      {lights && <Light />}
      <Balls
        roughness={roughness}
        metalness={metalness}
        reflectivity={reflectivity}
        view3DEnvMap={view3DEnvMap}
      />
    </View3D>
  );
}

View3DEnvMapStory.args = {
  autoRotate: true,
  background: 'backgrounds/overpass.hdr',
  view3DEnvMap: true,
  roughness: 0,
  metalness: 0.5,
  reflectivity: 0.5,
  lights: true,
};

View3DEnvMapStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  background: {
    control: { type: 'select' },
    options: [
      'backgrounds/store.jpg',
      'backgrounds/manga.jpg',
      'backgrounds/croatia.jpg',
      'backgrounds/overpass.hdr',
    ],
    description: 'Background texture',
    defaultValue: 'backgrounds/overpass.hdr',
  },
  view3DEnvMap: {
    control: { type: 'boolean' },
    description: 'Enable View3D environment mapping',
    defaultValue: true,
  },
  roughness: {
    control: { type: 'number', min: 0, max: 1, step: 0.1 },
    description: 'Roughness (physical and standard materials)',
    defaultValue: 0,
  },
  metalness: {
    control: { type: 'number', min: 0, max: 1, step: 0.1 },
    description: 'Metalness (physical and standard materials)',
    defaultValue: 0.5,
  },
  reflectivity: {
    control: { type: 'number', min: 0, max: 1, step: 0.1 },
    description: 'Reflectivity (basic materials)',
    defaultValue: 0.5,
  },
  lights: {
    control: { type: 'boolean' },
    description: 'Show lights',
    defaultValue: true,
  },
};

export default View3DEnvMapStory;
