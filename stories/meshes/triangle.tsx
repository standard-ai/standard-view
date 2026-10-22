// triangle.tsx
import React from 'react';

// standard-view
import { View3D, Triangle } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';

function TriangleStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'lime',
    hoverColor = 'red',
    hoverable = true,
    points = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
    indices = [[0, 1, 2]],
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
      <Triangle
        points={points}
        indices={indices}
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

TriangleStory.args = {
  autoRotate: true,
  color: 'lime',
  hoverColor: 'red',
  hoverable: true,
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  indices: [[0, 1, 2]],
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

TriangleStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Triangle color',
    defaultValue: 'lime',
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
    description: 'Triangle points',
    defaultValue: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
  },
  indices: {
    control: { type: 'object' },
    description: 'Triangle indices',
    defaultValue: [[0, 1, 2]],
  },
  position: {
    control: { type: 'object' },
    description: 'Triangle position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Triangle scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Triangle rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Triangle normal',
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

export default TriangleStory;
