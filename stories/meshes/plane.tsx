// plane.tsx
import React from 'react';

// standard-view
import { View3D, Plane } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';

function PlaneStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'violet',
    hoverColor = 'red',
    hoverable = true,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = [0, 0, 1],
    roll = 0,
    texturePath = 'none',
    textureURL = 'none',
    opacity = 1,
    side = 'double',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
  } = args || {};

  const finalTexturePath = texturePath !== 'none' ? texturePath : undefined;
  const finalTextureURL = textureURL !== 'none' ? textureURL : undefined;

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Plane
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
        texturePath={finalTexturePath}
        textureURL={finalTextureURL}
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

PlaneStory.args = {
  autoRotate: true,
  color: 'violet',
  hoverColor: 'red',
  hoverable: true,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: [0, 0, 1],
  roll: 0,
  texturePath: 'none',
  textureURL: 'none',
  opacity: 1,
  side: 'double',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
};

PlaneStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Plane color',
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
  position: {
    control: { type: 'object' },
    description: 'Plane position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Plane scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Plane rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Plane normal',
    defaultValue: [0, 0, 1],
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  texturePath: {
    control: { type: 'select' },
    options: ['none', 'backgrounds/', 'standard-cube/'],
    description: 'Texture path',
    defaultValue: 'none',
  },
  textureURL: {
    control: { type: 'select' },
    options: [
      'none',
      'sc.jpg',
      'croatia.jpg',
      'drawingroom.jpg',
      'fridge.png',
      'manga.jpg',
      'modern-room.jpg',
      'space.png',
      'pattern.jpg',
      'snow-mountain.jpg',
      'snow-mountain2.jpg',
      'snow.jpg',
      'store.jpg',
    ],
    description: 'Texture URL',
    defaultValue: 'none',
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

export default PlaneStory;
