// label.tsx
import React from 'react';

// standard-view
import { View3D, Label } from '../../src';
import { view3DProps, Ground, Light } from '../utils/common';
import { DEFAULT_NORMAL } from '../../src/utils/constants';

function LabelStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    text = 'Label',
    fontName = 'sans-serif',
    fontStyle = '',
    textColor = 'white',
    backgroundColor = 'black',
    noBackground = false,
    borderColor = 'white',
    borderThickness = 10,
    noBorder = false,
    resolution = 32,
    align = 'center',
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    hoverColor = 'red',
    hoverable = true,
    opacity = 1,
    side = 'double',
    materialType = 'basic',
    castShadow = true,
    wireframe = false,
    billboard = false,
  } = args || {};

  const finalAlign = align !== '' ? align : null;
  const finalText = text || undefined;

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Label
        text={finalText}
        fontName={fontName}
        fontStyle={fontStyle}
        textColor={textColor}
        backgroundColor={backgroundColor}
        noBackground={noBackground}
        borderColor={borderColor}
        borderThickness={borderThickness}
        noBorder={noBorder}
        resolution={resolution}
        align={finalAlign}
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
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

LabelStory.args = {
  autoRotate: true,
  text: 'Label',
  fontName: 'sans-serif',
  fontStyle: '',
  textColor: 'white',
  backgroundColor: 'black',
  noBackground: false,
  borderColor: 'white',
  borderThickness: 10,
  noBorder: false,
  resolution: 32,
  align: 'center',
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  hoverColor: 'red',
  hoverable: true,
  opacity: 1,
  side: 'double',
  materialType: 'basic',
  castShadow: true,
  wireframe: false,
  billboard: false,
};

LabelStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  text: {
    control: { type: 'text' },
    description: 'Label text',
    defaultValue: 'Label',
  },
  fontName: {
    control: { type: 'text' },
    description: 'Font name',
    defaultValue: 'sans-serif',
  },
  fontStyle: {
    control: { type: 'text' },
    description: 'Font style',
    defaultValue: '',
  },
  textColor: {
    control: { type: 'color' },
    description: 'Text color',
    defaultValue: 'white',
  },
  backgroundColor: {
    control: { type: 'color' },
    description: 'Background color',
    defaultValue: 'black',
  },
  noBackground: {
    control: { type: 'boolean' },
    description: 'No background',
    defaultValue: false,
  },
  borderColor: {
    control: { type: 'color' },
    description: 'Border color',
    defaultValue: 'white',
  },
  borderThickness: {
    control: { type: 'number', min: 0, max: 50, step: 1 },
    description: 'Border thickness',
    defaultValue: 10,
  },
  noBorder: {
    control: { type: 'boolean' },
    description: 'No border',
    defaultValue: false,
  },
  resolution: {
    control: { type: 'number', min: 8, max: 128, step: 1 },
    description: 'Resolution',
    defaultValue: 32,
  },
  align: {
    control: { type: 'text' },
    description: 'Text alignment',
    defaultValue: 'center',
  },
  position: {
    control: { type: 'object' },
    description: 'Label position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Label scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Label rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Label normal',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
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
    description: 'Billboard label',
    defaultValue: false,
  },
};

export default LabelStory;
