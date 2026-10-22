// path.tsx
import React from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Path from '../../src/groups/Path';
import { view3DProps, Ground, Light } from '../utils/common';

function PathComponent({
  autoRotate,
  points,
  hoverColor,
  pointColor,
  lineColor,
  materialType,
  thickness,
  lineThickness,
  pointRadius,
  point,
  frame,
  enumerate,
}: any): React.ReactNode {
  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Ground />
      <Light />
      <Path
        points={points}
        hoverColor={hoverColor}
        lineColor={lineColor}
        pointColor={pointColor}
        thickness={thickness}
        lineThickness={lineThickness}
        pointRadius={pointRadius}
        point={point}
        frame={frame}
        materialType={materialType}
        enumerate={enumerate}
        castShadow
      />
    </View3D>
  );
}

export function PathStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    points = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 1, 0],
    ],
    hoverColor = 'yellow',
    pointColor = 'red',
    lineColor = 'lime',
    materialType = 'physical',
    thickness = 0.1,
    lineThickness = 0.1,
    pointRadius = 0.2,
    point = [0, 0, 0],
    frame = 0,
    enumerate = false,
  } = args || {};

  const props = {
    autoRotate,
    points,
    hoverColor,
    pointColor,
    lineColor,
    materialType,
    thickness: thickness || undefined,
    lineThickness,
    pointRadius,
    point,
    frame,
    enumerate,
  };

  return <PathComponent {...props} />;
}

PathStory.args = {
  autoRotate: true,
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [2, 1, 0],
  ],
  hoverColor: 'yellow',
  pointColor: 'red',
  lineColor: 'lime',
  materialType: 'physical',
  thickness: 0.1,
  lineThickness: 0.1,
  pointRadius: 0.2,
  point: [0, 0, 0],
  frame: 0,
  enumerate: false,
};

PathStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Hover color',
    defaultValue: 'yellow',
  },
  pointColor: {
    control: { type: 'color' },
    description: 'Point color',
    defaultValue: 'red',
  },
  lineColor: {
    control: { type: 'color' },
    description: 'Line color',
    defaultValue: 'lime',
  },
  materialType: {
    control: { type: 'select' },
    options: ['basic', 'lambert', 'phong', 'physical', 'standard'],
    description: 'Material type',
    defaultValue: 'physical',
  },
  thickness: {
    control: { type: 'number', min: 0.01, max: 1, step: 0.01 },
    description: 'Path thickness',
    defaultValue: 0.1,
  },
  pointRadius: {
    control: { type: 'number', min: 0.01, max: 1, step: 0.01 },
    description: 'Point radius',
    defaultValue: 0.2,
  },
  lineThickness: {
    control: { type: 'number', min: 0.01, max: 1, step: 0.01 },
    description: 'Line thickness',
    defaultValue: 0.1,
  },
  points: {
    control: { type: 'object' },
    description: 'Path points',
    defaultValue: [
      [0, 0, 0],
      [1, 0, 0],
      [2, 1, 0],
    ],
  },
  point: {
    control: { type: 'object' },
    description: 'Current point',
    defaultValue: [0, 0, 0],
  },
  frame: {
    control: { type: 'number', min: 0, max: 100, step: 1 },
    description: 'Current frame',
    defaultValue: 0,
  },
  enumerate: {
    control: { type: 'boolean' },
    description: 'Show enumeration',
    defaultValue: false,
  },
};

export default PathStory;
