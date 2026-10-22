// text.tsx
import React from 'react';

// standard-view
import { View3D, Text } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';
import { DEFAULT_NORMAL } from '../../src/utils/constants';

function TextStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    text = 'Text',
    fontName = 'helvetiker',
    fontFile = '',
    size = 1,
    depth = 0.01,
    align = 'bottom-left',
    curveSegments = 12,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    color = 'red',
    hoverColor = 'yellow',
    hoverable = true,
    opacity = 1,
    side = 'double',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
    billboard = false,
  } = args || {};

  const finalAlign = align !== '' ? align : null;

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Text
        text={text}
        fontName={fontName}
        fontFile={fontFile}
        size={size}
        depth={depth}
        align={finalAlign}
        curveSegments={curveSegments}
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
        billboard={billboard}
      />
    </View3D>
  );
}

TextStory.args = {
  autoRotate: true,
  text: 'Text',
  fontName: 'helvetiker',
  fontFile: '',
  size: 1,
  depth: 0.01,
  align: 'bottom-left',
  curveSegments: 12,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  color: 'red',
  hoverColor: 'yellow',
  hoverable: true,
  opacity: 1,
  side: 'double',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
  billboard: false,
};

TextStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  text: {
    control: { type: 'text' },
    description: 'Text content',
    defaultValue: 'Text',
  },
  fontName: {
    control: { type: 'text' },
    description: 'Font name',
    defaultValue: 'helvetiker',
  },
  fontFile: {
    control: { type: 'text' },
    description: 'Font file',
    defaultValue: '',
  },
  size: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Text size',
    defaultValue: 1,
  },
  depth: {
    control: { type: 'number', min: 0.001, max: 0.1, step: 0.001 },
    description: 'Text depth',
    defaultValue: 0.01,
  },
  align: {
    control: { type: 'text' },
    description: 'Text alignment',
    defaultValue: 'bottom-left',
  },
  curveSegments: {
    control: { type: 'number', min: 1, max: 32, step: 1 },
    description: 'Curve segments',
    defaultValue: 12,
  },
  position: {
    control: { type: 'object' },
    description: 'Text position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Text scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Text rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Text normal',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  color: {
    control: { type: 'color' },
    description: 'Text color',
    defaultValue: 'red',
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Color on hover',
    defaultValue: 'yellow',
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
  billboard: {
    control: { type: 'boolean' },
    description: 'Billboard text',
    defaultValue: false,
  },
};

export default TextStory;
