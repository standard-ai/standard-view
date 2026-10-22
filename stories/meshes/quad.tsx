// quad.tsx
import React from 'react';

// standard-view
import { View3D, Quad, PointLight } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';
import { EPS_NANO } from '../../src/utils/math';

function QuadStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'violet',
    hoverColor = 'red',
    hoverable = true,
    points = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
    indices = [
      [0, 1, 2],
      [2, 3, 0],
    ],
    coplanarThreshold = EPS_NANO,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = [0, 0, 1],
    roll = 0,
    opacity = 1,
    side = 'double',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Ground position={[0, -4, 0]} />
      <Light />
      <PointLight position={[2, 0, 0]} />
      <Quad
        points={points}
        indices={indices}
        coplanarThreshold={coplanarThreshold}
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
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

QuadStory.args = {
  autoRotate: true,
  color: 'violet',
  hoverColor: 'red',
  hoverable: true,
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
  indices: [
    [0, 1, 2],
    [2, 3, 0],
  ],
  coplanarThreshold: EPS_NANO,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: [0, 0, 1],
  roll: 0,
  opacity: 1,
  side: 'double',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
};

QuadStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Quad color',
    defaultValue: 'violet',
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
  points: {
    control: { type: 'object' },
    description: 'Quad points',
    defaultValue: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  indices: {
    control: { type: 'object' },
    description: 'Quad indices',
    defaultValue: [
      [0, 1, 2],
      [2, 3, 0],
    ],
  },
  coplanarThreshold: {
    control: { type: 'number', min: 0, max: 0.001, step: 0.000001 },
    description: 'Coplanar threshold',
    defaultValue: EPS_NANO,
  },
  position: {
    control: { type: 'object' },
    description: 'Quad position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Quad scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Quad rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Quad normal',
    defaultValue: [0, 0, 1],
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
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

export default QuadStory;
