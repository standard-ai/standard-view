// bounding-box.tsx
import React from 'react';

// standard-view
import { View3D, BoundingBox } from '../../src';
import { Light, Ground, view3DProps } from '../utils/common';

function BoundingBoxStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = false,
    color = 'lime',
    min = [0, 0, 0],
    max = [1, 1, 1],
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    castShadow = true,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground />
      <BoundingBox
        min={min}
        max={max}
        position={position}
        scale={scale}
        rotation={rotation}
        color={color}
        castShadow={castShadow}
      />
    </View3D>
  );
}

BoundingBoxStory.args = {
  autoRotate: false,
  color: 'lime',
  min: [0, 0, 0],
  max: [1, 1, 1],
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  castShadow: true,
};

BoundingBoxStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: false,
  },
  color: {
    control: { type: 'color' },
    description: 'Bounding box color',
    defaultValue: 'lime',
  },
  min: {
    control: { type: 'object' },
    description: 'Minimum bounds',
    defaultValue: [0, 0, 0],
  },
  max: {
    control: { type: 'object' },
    description: 'Maximum bounds',
    defaultValue: [1, 1, 1],
  },
  position: {
    control: { type: 'object' },
    description: 'Position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Rotation',
    defaultValue: [0, 0, 0],
  },
  castShadow: {
    control: { type: 'boolean' },
    description: 'Cast shadows',
    defaultValue: true,
  },
};

export default BoundingBoxStory;
