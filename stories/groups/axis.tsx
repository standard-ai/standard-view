// axis.tsx
import React from 'react';
import { view3DProps } from '../utils/common';

// standard-view
import { View3D, Axis } from '../../src';

function AxisStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    xColor = 'red',
    yColor = 'blue',
    zColor = 'lime',
    position = [0, 0, 0],
    x = [1, 0, 0],
    y = [0, 1, 0],
    z = [0, 0, 1],
    xLabel = 'x',
    yLabel = 'y',
    zLabel = 'z',
    labelSize = 0.2,
    labelDepth = 0.02,
    labelRotation = [0, 0, 0],
    thickness = 0.1,
  } = args || {};

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Axis
        position={position}
        x={x}
        y={y}
        z={z}
        xLabel={xLabel}
        yLabel={yLabel}
        zLabel={zLabel}
        xColor={xColor}
        yColor={yColor}
        zColor={zColor}
        labelSize={labelSize}
        labelDepth={labelDepth}
        labelRotation={labelRotation}
        thickness={thickness}
      />
    </View3D>
  );
}

AxisStory.args = {
  autoRotate: true,
  xColor: 'red',
  yColor: 'blue',
  zColor: 'lime',
  position: [0, 0, 0],
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
  xLabel: 'x',
  yLabel: 'y',
  zLabel: 'z',
  labelSize: 0.2,
  labelDepth: 0.02,
  labelRotation: [0, 0, 0],
  thickness: 0.1,
};

AxisStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  xColor: {
    control: { type: 'color' },
    description: 'X-axis color',
    defaultValue: 'red',
  },
  yColor: {
    control: { type: 'color' },
    description: 'Y-axis color',
    defaultValue: 'blue',
  },
  zColor: {
    control: { type: 'color' },
    description: 'Z-axis color',
    defaultValue: 'lime',
  },
  position: {
    control: { type: 'object' },
    description: 'Axis position',
    defaultValue: [0, 0, 0],
  },
  x: {
    control: { type: 'object' },
    description: 'X-axis direction',
    defaultValue: [1, 0, 0],
  },
  y: {
    control: { type: 'object' },
    description: 'Y-axis direction',
    defaultValue: [0, 1, 0],
  },
  z: {
    control: { type: 'object' },
    description: 'Z-axis direction',
    defaultValue: [0, 0, 1],
  },
  xLabel: {
    control: { type: 'text' },
    description: 'X-axis label',
    defaultValue: 'x',
  },
  yLabel: {
    control: { type: 'text' },
    description: 'Y-axis label',
    defaultValue: 'y',
  },
  zLabel: {
    control: { type: 'text' },
    description: 'Z-axis label',
    defaultValue: 'z',
  },
  labelSize: {
    control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
    description: 'Label size',
    defaultValue: 0.2,
  },
  labelDepth: {
    control: { type: 'number', min: 0.01, max: 0.1, step: 0.01 },
    description: 'Label depth',
    defaultValue: 0.02,
  },
  labelRotation: {
    control: { type: 'object' },
    description: 'Label rotation',
    defaultValue: [0, 0, 0],
  },
  thickness: {
    control: { type: 'number', min: 0.01, max: 1, step: 0.01 },
    description: 'Axis thickness',
    defaultValue: 0.1,
  },
};

export default AxisStory;
