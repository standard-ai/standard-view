// pcd.tsx
import React from 'react';

// standard-view
import { View3D, PCD } from '../../src';
import { DEFAULT_NORMAL } from '../../src/utils/constants';
import { STORY_STYLE } from '../utils/common';

function PCDComponent({
  autoRotate,
  visible,
  pcdPath,
  pcdURL,
  scale,
  position,
  rotation,
  normal,
  roll,
  pointSize,
  hoverColor,
}: any): React.ReactNode {
  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, 0, 2],
        up: [0, -1, 0],
      }}
      orbitControls
      style={STORY_STYLE}
      controls={{ autoRotate }}
    >
      <PCD
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
        pcdPath={pcdPath}
        pcdURL={pcdURL}
        visible={visible}
        pointSize={pointSize}
        hoverColor={hoverColor}
      />
    </View3D>
  );
}

export function PCDStory(args: any = {}): React.ReactElement {
  const {
    autoRotate = true,
    visible = true,
    pcdPath = 'pcd/',
    pcdURL = 'pcl.pcd',
    scale = [1, 1, 1],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    normal = DEFAULT_NORMAL,
    roll = 0,
    pointSize = 0.01,
    hoverColor = 'yellow',
  } = args || {};

  const props = {
    autoRotate,
    visible,
    pcdPath,
    pcdURL,
    scale,
    position,
    rotation,
    normal,
    roll,
    pointSize,
    hoverColor,
  };

  return <PCDComponent {...props} />;
}

PCDStory.args = {
  autoRotate: true,
  visible: true,
  pcdPath: 'pcd/',
  pcdURL: 'pcl.pcd',
  scale: [1, 1, 1],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  normal: DEFAULT_NORMAL,
  roll: 0,
  pointSize: 0.01,
  hoverColor: 'yellow',
};

PCDStory.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  visible: {
    control: { type: 'boolean' },
    description: 'Model visibility',
    defaultValue: true,
  },
  pcdPath: {
    control: { type: 'text' },
    description: 'PCD file path',
    defaultValue: 'pcd/',
  },
  pcdURL: {
    control: { type: 'text' },
    description: 'PCD file URL',
    defaultValue: 'pcl.pcd',
  },
  scale: {
    control: { type: 'object' },
    description: 'Model scale',
    defaultValue: [1, 1, 1],
  },
  position: {
    control: { type: 'object' },
    description: 'Model position',
    defaultValue: [0, 0, 0],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Model rotation',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Model normal',
    defaultValue: DEFAULT_NORMAL,
  },
  roll: {
    control: { type: 'number', min: 0, max: Math.PI * 2, step: 0.1 },
    description: 'Roll angle',
    defaultValue: 0,
  },
  pointSize: {
    control: { type: 'number', min: 0.001, max: 0.1, step: 0.001 },
    description: 'Point size',
    defaultValue: 0.01,
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Tint applied to the point cloud while the pointer is over it',
    defaultValue: 'yellow',
  },
};

export default PCDStory;
