// polygon.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Polygon from '../../src/primitives/Polygon';
import { view3DProps, Ground, Light } from '../utils/common';

function PolygonStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'lime',
    hoverColor = 'red',
    hoverable = true,
    points = [
      [0, 0],
      [2, 0],
      [3, 1],
      [2, 2],
      [0, 2],
    ],
    depth = 0,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = [0, 0, 1],
    roll = 0,
    opacity = 1,
    side = 'front',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Ground position={[0, -4, 0]} />
      <Light />
      <Polygon
        points={points}
        depth={depth}
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

PolygonStory.args = {
  autoRotate: true,
  color: 'lime',
  hoverColor: 'red',
  hoverable: true,
  points: [
    [0, 0],
    [2, 0],
    [3, 1],
    [2, 2],
    [0, 2],
  ],
  depth: 0,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: [0, 0, 1],
  roll: 0,
  opacity: 1,
  side: 'front',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
};

PolygonStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Polygon color',
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
    description: 'Polygon points',
    defaultValue: [
      [0, 0],
      [2, 0],
      [3, 1],
      [2, 2],
      [0, 2],
    ],
  },
  depth: {
    control: { type: 'number', min: 0, max: 2, step: 0.1 },
    description: 'Polygon depth',
    defaultValue: 0,
  },
  position: {
    control: { type: 'object' },
    description: 'Polygon position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Polygon scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Polygon rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Polygon normal',
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
    defaultValue: 'front',
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

export default PolygonStory;
