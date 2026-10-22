// hemisphere-light.tsx
import React from 'react';
import { view3DProps, Ground, Balls } from '../utils/common';

// standard-view
import { View3D, HemisphereLight } from '../../src';

function HemisphereLightStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    skyColor = 'lightskyblue',
    groundColor = 'sandybrown',
    position = [0, 1, 0],
    intensity = 2,
    helperSize = 1,
    helper = true,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="standard" />
      <HemisphereLight
        position={position}
        skyColor={skyColor}
        groundColor={groundColor}
        intensity={intensity}
        helperSize={helperSize}
        helper={helper}
      />
    </View3D>
  );
}

HemisphereLightStory.args = {
  autoRotate: true,
  skyColor: 'lightskyblue',
  groundColor: 'sandybrown',
  position: [0, 1, 0],
  intensity: 2,
  helperSize: 1,
  helper: true,
};

HemisphereLightStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  skyColor: {
    control: { type: 'color' },
    description: 'Sky color',
    defaultValue: 'lightskyblue',
  },
  groundColor: {
    control: { type: 'color' },
    description: 'Ground color',
    defaultValue: 'sandybrown',
  },
  position: {
    control: { type: 'object' },
    description: 'Light position',
    defaultValue: [0, 1, 0],
  },
  intensity: {
    control: { type: 'number', min: 0, max: 10, step: 1 },
    description: 'Light intensity',
    defaultValue: 2,
  },
  helperSize: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Helper size',
    defaultValue: 1,
  },
  helper: {
    control: { type: 'boolean' },
    description: 'Show light helper',
    defaultValue: true,
  },
};

export default HemisphereLightStory;
