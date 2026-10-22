// circle.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Circle from '../../src/primitives/Circle';
import { view3DProps, Ground, Light } from '../utils/common';
import { DEFAULT_NORMAL } from '../../src/utils/constants';

export function CircleComponent(props): React.ReactNode {
  const { autoRotate, ...circleProps } = props;
  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Circle {...circleProps} />
    </View3D>
  );
}

export function CircleStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'yellow',
    hoverColor = 'red',
    hoverable = true,
    position = [0, 0, 0],
    radius = 1,
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    segments = 32,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
    opacity = 1,
    side = 'double',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
  } = args || {};

  const props = {
    autoRotate,
    color,
    hoverColor,
    hoverable,
    position,
    scale,
    rotation,
    normal,
    roll,
    radius,
    segments,
    thetaStart,
    thetaLength,
    opacity,
    side,
    materialType,
    castShadow,
    wireframe,
  };

  return <CircleComponent {...props} />;
}

CircleStory.args = {
  autoRotate: true,
  color: 'yellow',
  hoverColor: 'red',
  hoverable: true,
  position: [0, 0, 0],
  radius: 1,
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  segments: 32,
  thetaStart: 0,
  thetaLength: Math.PI * 2,
  opacity: 1,
  side: 'double',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
};

CircleStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Circle color',
    defaultValue: 'yellow',
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Color on hover',
    defaultValue: 'red',
  },
  hoverable: {
    control: { type: 'boolean' },
    description: 'Enable hover effects',
    defaultValue: true,
  },
  position: {
    control: { type: 'object' },
    description: 'Circle position',
    defaultValue: [0, 0, 0],
  },
  radius: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Circle radius',
    defaultValue: 1,
  },
  scale: {
    control: { type: 'object' },
    description: 'Circle scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Circle rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Circle normal',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  segments: {
    control: { type: 'number', min: 3, max: 64, step: 1 },
    description: 'Number of segments',
    defaultValue: 32,
  },
  thetaStart: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Theta start angle',
    defaultValue: 0,
  },
  thetaLength: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Theta length',
    defaultValue: Math.PI * 2,
  },
  opacity: {
    control: { type: 'number', min: 0, max: 1, step: 0.1 },
    description: 'Material opacity',
    defaultValue: 1,
  },
  side: {
    control: { type: 'select' },
    options: ['front', 'back', 'double'],
    description: 'Material side',
    defaultValue: 'double',
  },
  materialType: {
    control: { type: 'select' },
    options: ['basic', 'lambert', 'phong', 'physical', 'standard'],
    description: 'Material type',
    defaultValue: 'basic',
  },
  castShadow: {
    control: { type: 'boolean' },
    description: 'Cast shadows',
    defaultValue: true,
  },
  wireframe: {
    control: { type: 'boolean' },
    description: 'Show wireframe',
    defaultValue: false,
  },
};

export default CircleStory;
