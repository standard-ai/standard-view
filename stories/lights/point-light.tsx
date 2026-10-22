// point-light.tsx
import React from 'react';
import { view3DProps, Ground, Balls } from '../utils/common';

// standard-view
import { View3D, PointLight } from '../../src';

function PointLightStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'white',
    position = [2, 4, 2],
    intensity = 50,
    distance = 100,
    decay = 2,
    castShadow = true,
    helper = true,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="physical" />
      <PointLight
        position={position}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={decay}
        castShadow={castShadow}
        helper={helper}
      />
    </View3D>
  );
}

PointLightStory.args = {
  autoRotate: true,
  color: 'white',
  position: [2, 4, 2],
  intensity: 50,
  decay: 2,
  distance: 100,
  castShadow: true,
  helper: true,
};

PointLightStory.argTypes = {
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
  position: {
    control: { type: 'object' },
    description: 'Light position',
    defaultValue: [2, 4, 2],
  },
  intensity: {
    control: { type: 'number', min: 0, max: 100, step: 10 },
    description: 'Light intensity',
    defaultValue: 50,
  },
  decay: {
    control: { type: 'number', min: 0, max: 100, step: 10 },
    description: 'Light decay',
    defaultValue: 2,
  },
  distance: {
    control: { type: 'number', min: 0, max: 1000, step: 10 },
    description: 'Light distance',
    defaultValue: 100,
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
};

export default PointLightStory;
