// sphere.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Sphere from '../../src/primitives/Sphere';
import { view3DProps, Ground, Light } from '../utils/common';

function SphereStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    color = 'gold',
    hoverColor = 'red',
    hoverable = true,
    radius = 1,
    widthSegments = 32,
    heightSegments = 32,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
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
      <Sphere
        radius={radius}
        widthSegments={widthSegments}
        heightSegments={heightSegments}
        phiStart={phiStart}
        phiLength={phiLength}
        thetaStart={thetaStart}
        thetaLength={thetaLength}
        position={position}
        scale={scale}
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

SphereStory.args = {
  autoRotate: true,
  color: 'gold',
  hoverColor: 'red',
  hoverable: true,
  radius: 1,
  widthSegments: 32,
  heightSegments: 32,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  opacity: 1,
  side: 'double',
  materialType: 'physical',
  castShadow: true,
  wireframe: false,
};

SphereStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  color: {
    control: { type: 'color' },
    description: 'Sphere color',
    defaultValue: 'gold',
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
  radius: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Sphere radius',
    defaultValue: 1,
  },
  widthSegments: {
    control: { type: 'number', min: 3, max: 64, step: 1 },
    description: 'Width segments',
    defaultValue: 32,
  },
  heightSegments: {
    control: { type: 'number', min: 2, max: 64, step: 1 },
    description: 'Height segments',
    defaultValue: 32,
  },
  phiStart: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Phi start angle',
    defaultValue: 0,
  },
  phiLength: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Phi length',
    defaultValue: Math.PI * 2,
  },
  thetaStart: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Theta start angle',
    defaultValue: 0,
  },
  thetaLength: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Theta length',
    defaultValue: Math.PI,
  },
  position: {
    control: { type: 'object' },
    description: 'Sphere position',
    defaultValue: [0, 0, 0],
  },
  scale: {
    control: { type: 'object' },
    description: 'Sphere scale',
    defaultValue: [1, 1, 1],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Sphere rotation',
    defaultValue: [0, 0, 0],
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

export default SphereStory;
