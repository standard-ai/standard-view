// directional-light.tsx
import React from 'react';
import { view3DProps, Ground, Balls } from '../utils/common';

// standard-view
import { View3D, DirectionalLight } from '../../src';

function DirectionalLightStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'white',
    intensity = 2,
    position = [2, 4, 2],
    target = [0, 0, 0],
    castShadow = true,
    helper = true,
    helperColor = 'white',
    helperSize = 1,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="physical" />
      <DirectionalLight
        position={position}
        target={target}
        color={color}
        intensity={intensity}
        castShadow={castShadow}
        helper={helper}
        helperColor={helperColor}
        helperSize={helperSize}
      />
    </View3D>
  );
}

DirectionalLightStory.args = {
  autoRotate: true,
  color: 'white',
  intensity: 2,
  position: [2, 4, 2],
  target: [0, 0, 0],
  castShadow: true,
  helper: true,
  helperColor: 'white',
  helperSize: 1,
};

DirectionalLightStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Light color',
    defaultValue: 'white',
  },
  intensity: {
    control: { type: 'number', min: 0, max: 20, step: 1 },
    description: 'Light intensity',
    defaultValue: 2,
  },
  position: {
    control: { type: 'object' },
    description: 'Light position',
    defaultValue: [2, 4, 2],
  },
  target: {
    control: { type: 'object' },
    description: 'Light target',
    defaultValue: [0, 0, 0],
  },
  castShadow: {
    control: { type: 'boolean' },
    description: 'Enable shadow casting',
    defaultValue: true,
  },
  helper: {
    control: { type: 'boolean' },
    description: 'Show light helper',
    defaultValue: true,
  },
  helperColor: {
    control: { type: 'color' },
    description: 'Helper color',
    defaultValue: 'white',
  },
  helperSize: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Helper size',
    defaultValue: 1,
  },
};

export default DirectionalLightStory;
