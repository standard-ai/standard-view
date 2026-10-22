// cylinder.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Cylinder from '../../src/primitives/Cylinder';
import { view3DProps, Ground, Light } from '../utils/common';

function CylinderStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'blue',
    hoverColor = 'red',
    hoverable = true,
    position = [0, 0, 0],
    start = [0, -0.5, 0],
    end = [0, 0.5, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    roll = 0,
    radius = 1,
    radiusTop = 1,
    radiusBottom = 1,
    radialSegments = 32,
    heightSegments = 1,
    openEnded = false,
    opacity = 1,
    side = 'double',
    materialType = 'physical',
    castShadow = true,
    wireframe = false,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Cylinder
        position={position}
        start={start}
        end={end}
        scale={scale}
        rotation={rotation}
        roll={roll}
        radius={radius}
        radiusTop={radiusTop}
        radiusBottom={radiusBottom}
        radialSegments={radialSegments}
        heightSegments={heightSegments}
        openEnded={openEnded}
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

CylinderStory.args = {
  autoRotate: true,
  color: 'blue',
  hoverColor: 'red',
  hoverable: true,
  position: [0, 0, 0],
  start: [0, -0.5, 0],
  end: [0, 0.5, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  roll: 0,
  radius: 1,
  radiusTop: 1,
  radiusBottom: 1,
  radialSegments: 32,
  heightSegments: 1,
  openEnded: false,
  opacity: 1,
  side: 'double',
  materialType: 'physical',
  castShadow: true,
  wireframe: false,
};

CylinderStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Cylinder color',
    defaultValue: 'blue',
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
    description: 'Cylinder position',
    defaultValue: [0, 0, 0],
  },
  start: {
    control: { type: 'object' },
    description: 'Start point',
    defaultValue: [0, -0.5, 0],
  },
  end: {
    control: { type: 'object' },
    description: 'End point',
    defaultValue: [0, 0.5, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Cylinder scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Cylinder rotation',
    defaultValue: [0, 0, 0],
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  radius: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Cylinder radius',
    defaultValue: 1,
  },
  radiusTop: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Top radius',
    defaultValue: 1,
  },
  radiusBottom: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Bottom radius',
    defaultValue: 1,
  },
  radialSegments: {
    control: { type: 'number', min: 3, max: 64, step: 1 },
    description: 'Radial segments',
    defaultValue: 32,
  },
  heightSegments: {
    control: { type: 'number', min: 1, max: 16, step: 1 },
    description: 'Height segments',
    defaultValue: 1,
  },
  openEnded: {
    control: { type: 'boolean' },
    description: 'Open ended',
    defaultValue: false,
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

export default CylinderStory;
