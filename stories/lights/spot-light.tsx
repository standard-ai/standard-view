// spot-light.tsx
import React from 'react';

// standard-view
import { View3D, SpotLight } from '../../src';
import { view3DProps, Ground, Balls } from '../utils/common';

function SpotLightStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'white',
    position = [2, 4, 2],
    intensity = 5,
    distance = 300,
    decay = 0.5,
    penumbra = 0.5,
    angle = Math.PI * 0.333,
    castShadow = true,
    helper = true,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="physical" />
      <SpotLight
        position={position}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={decay}
        penumbra={penumbra}
        angle={angle}
        castShadow={castShadow}
        helper={helper}
      />
    </View3D>
  );
}

SpotLightStory.args = {
  autoRotate: true,
  color: 'white',
  position: [2, 4, 2],
  intensity: 5,
  distance: 300,
  decay: 0.5,
  penumbra: 0.5,
  angle: Math.PI * 0.333,
  castShadow: true,
  helper: true,
};

SpotLightStory.argTypes = {
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
    control: { type: 'number', min: 0, max: 10, step: 2 },
    description: 'Light intensity',
    defaultValue: 5,
  },
  distance: {
    control: { type: 'number', min: 0, max: 1000, step: 10 },
    description: 'Light distance',
    defaultValue: 300,
  },
  decay: {
    control: { type: 'number', min: 0, max: 2, step: 0.1 },
    description: 'Light decay',
    defaultValue: 0.5,
  },
  penumbra: {
    control: { type: 'number', min: 0, max: 1, step: 0.1 },
    description: 'Light penumbra',
    defaultValue: 0.5,
  },
  angle: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Light angle',
    defaultValue: Math.PI * 0.333,
  },
  castShadow: {
    control: { type: 'boolean' },
    description: 'Cast shadows',
    defaultValue: true,
  },
  helper: {
    control: { type: 'boolean' },
    description: 'Show helper',
    defaultValue: true,
  },
};

export default SpotLightStory;
