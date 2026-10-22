// arrow.tsx
import React from 'react';

// standard-view
import { View3D, Arrow, Axis } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';

function ArrowStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'magenta',
    hoverColor = 'red',
    tail = [0, 0, 0],
    start = [],
    position = [],
    head = [1, 1, 1],
    end = [],
    target = [],
    normal = [],
    roll = 0,
    magnitude = 1,
    radius = 0.05,
    rotation = [0, 0, 0],
    hoverable = true,
    opacity = 1,
    side = 'double',
    materialType = 'physical',
    castShadow = true,
    wireframe = false,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -3, 0]} />
      <Axis thickness={0.03} />
      <Arrow
        tail={tail}
        start={start}
        position={position}
        head={head}
        end={end}
        target={target}
        normal={normal}
        roll={roll}
        magnitude={magnitude}
        radius={radius}
        rotation={rotation}
        color={color}
        hoverColor={hoverColor}
        hoverable={hoverable}
        opacity={opacity}
        side={side}
        materialType={materialType}
        castShadow={castShadow}
        wireframe={wireframe}
      />
    </View3D>
  );
}

ArrowStory.args = {
  autoRotate: true,
  color: 'magenta',
  hoverColor: 'red',
  tail: [0, 0, 0],
  start: [],
  position: [],
  head: [1, 1, 1],
  end: [],
  target: [],
  normal: [],
  roll: 0,
  magnitude: 1,
  radius: 0.05,
  rotation: [0, 0, 0],
  hoverable: true,
  opacity: 1,
  side: 'double',
  materialType: 'physical',
  castShadow: true,
  wireframe: false,
};

ArrowStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Arrow color',
    defaultValue: 'magenta',
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Color on hover',
    defaultValue: 'red',
  },
  tail: {
    control: { type: 'object' },
    description: 'Arrow tail position',
    defaultValue: [0, 0, 0],
  },
  start: {
    control: { type: 'object' },
    description: 'Arrow start position',
    defaultValue: [],
  },
  position: {
    control: { type: 'object' },
    description: 'Arrow position',
    defaultValue: [],
  },
  head: {
    control: { type: 'object' },
    description: 'Arrow head direction',
    defaultValue: [1, 1, 1],
  },
  end: {
    control: { type: 'object' },
    description: 'Arrow end position',
    defaultValue: [],
  },
  target: {
    control: { type: 'object' },
    description: 'Arrow target',
    defaultValue: [],
  },
  normal: {
    control: { type: 'object' },
    description: 'Normal vector',
    defaultValue: [],
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  magnitude: {
    control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
    description: 'Arrow magnitude',
    defaultValue: 1,
  },
  radius: {
    control: { type: 'number', min: 0.01, max: 1, step: 0.01 },
    description: 'Arrow radius',
    defaultValue: 0.05,
  },
  rotation: {
    control: { type: 'object' },
    description: 'Arrow rotation',
    defaultValue: [0, 0, 0],
  },
  hoverable: {
    control: { type: 'boolean' },
    description: 'Enable hover effects',
    defaultValue: true,
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
    defaultValue: 'physical',
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

export default ArrowStory;
