// rect-area-light.tsx
import React from 'react';

// standard-view
import { View3D, RectAreaLight } from '../../src';
import { view3DProps, Ground, Balls } from '../utils/common';

function RectAreaLightStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'white',
    position = [5, 3, 2],
    target = [0, 0, 0],
    intensity = 10,
    width = 3,
    height = 3,
    helper = true,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="standard" roughness={0} metalness={0} />
      <RectAreaLight
        position={position}
        target={target}
        color={color}
        intensity={intensity}
        width={width}
        height={height}
        helper={helper}
      />
    </View3D>
  );
}

RectAreaLightStory.args = {
  autoRotate: true,
  color: 'white',
  position: [5, 3, 2],
  target: [0, 0, 0],
  intensity: 10,
  width: 3,
  height: 3,
  helper: true,
};

RectAreaLightStory.argTypes = {
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
    defaultValue: [5, 3, 2],
  },
  target: {
    control: { type: 'object' },
    description: 'Light target',
    defaultValue: [0, 0, 0],
  },
  intensity: {
    control: { type: 'number', min: 0, max: 100, step: 5 },
    description: 'Light intensity',
    defaultValue: 10,
  },
  width: {
    control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
    description: 'Light width',
    defaultValue: 3,
  },
  height: {
    control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
    description: 'Light height',
    defaultValue: 3,
  },
  helper: {
    control: { type: 'boolean' },
    description: 'Show helper',
    defaultValue: true,
  },
};

export default RectAreaLightStory;
