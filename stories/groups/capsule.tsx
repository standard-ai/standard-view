// capsule.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Capsule from '../../src/groups/Capsule';
import { view3DProps, Ground, Light } from '../utils/common';

function CapsuleStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'magenta',
    hoverColor = 'red',
    hoverable = true,
    position = [0, 0, 0],
    start = [0, -0.5, 0],
    end = [0, 0.5, 0],
    scale = [1, 1, 1],
    radius = 1,
    rotation = [0, 0, 0],
    roll = 0,
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
      <Capsule
        position={position}
        start={start}
        end={end}
        scale={scale}
        radius={radius}
        rotation={rotation}
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

CapsuleStory.args = {
  autoRotate: true,
  color: 'magenta',
  hoverColor: 'red',
  hoverable: true,
  position: [0, 0, 0],
  start: [0, -0.5, 0],
  end: [0, 0.5, 0],
  scale: [1, 1, 1],
  radius: 1,
  rotation: [0, 0, 0],
  roll: 0,
  opacity: 1,
  side: 'double',
  materialType: 'physical',
  castShadow: true,
  wireframe: false,
};

CapsuleStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Capsule color',
    defaultValue: 'magenta',
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
    description: 'Capsule position',
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
    description: 'Capsule scale',
    defaultValue: [1, 1, 1],
  },
  radius: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Capsule radius',
    defaultValue: 1,
  },
  rotation: {
    control: { type: 'object' },
    description: 'Capsule rotation',
    defaultValue: [0, 0, 0],
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

export default CapsuleStory;
