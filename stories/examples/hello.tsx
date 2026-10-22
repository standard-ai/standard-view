// hello.tsx
import React from 'react';
import View3D from '../../src/views/View3D';
import AmbientLight from '../../src/lights/AmbientLight';
import Box from '../../src/primitives/Box';

// The component as default export
export default function Hello(args: any = {}): React.ReactElement {
  return (
    <View3D orbitControls={true}>
      <AmbientLight intensity={0.5} />
      <Box color="hotpink" />
    </View3D>
  );
}

// Story configuration
export const HelloStory = {
  title: 'Hello',
  parameters: {
    docs: {
      description: {
        component: 'Simple Cube',
      },
    },
  },
  argTypes: {
    scale: {
      control: { type: 'object' },
      description: 'Hello scale',
      defaultValue: [2, 2, 2],
    },
  },
};
