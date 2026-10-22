// ambient-light.tsx
import React from 'react';
import { view3DProps, Ground, Balls } from '../utils/common';

// standard-view
import { View3D, AmbientLight } from '../../src';

function AmbientLightStory(args: any = {}): React.ReactElement {
  const { autoRotate = true, color = 'white', intensity = 2 } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground />
      <AmbientLight color={color} intensity={intensity} />
    </View3D>
  );
}

AmbientLightStory.args = {
  autoRotate: true,
  color: 'white',
  intensity: 2,
};

AmbientLightStory.argTypes = {
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
    control: { type: 'number', min: 0, max: 10, step: 1 },
    description: 'Light intensity',
    defaultValue: 2,
  },
};

export default AmbientLightStory;
