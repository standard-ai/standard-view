// rotation.tsx
import React from 'react';

// standard-view
import {
  View3D,
  GLTF,
  DirectionalLight,
  AmbientLight,
  Axis,
  Group,
  Arrow,
  Circle,
  Text,
} from '../../src';
import { Ground, view3DProps } from '../utils/common';

import { DEFAULT_RIGHT } from '../../src/utils/constants';

const Rotation = (args: any = {}): React.ReactElement => {
  const {
    quaternion = [],
    rotation = [0, 0, 0],
    normal = [0, 0, 1],
    roll = 0,
  } = args || {};

  return (
    <View3D
      {...view3DProps}
      camera={{ fov: 75, position: [3, 4, 4], target: [0, 3, 0] }}
    >
      <DirectionalLight castShadow position={[3, 10, 3]} intensity={3} />
      <AmbientLight intensity={2} />
      <Axis />
      <Group
        position={[0, 3, 0]}
        rotation={rotation}
        normal={normal}
        quaternion={quaternion}
        roll={roll}
      >
        <Arrow head={DEFAULT_RIGHT.map(val => val * 2)} color="orange" />
        <Arrow
          head={DEFAULT_RIGHT.map(val => val * 2)}
          color="orange"
          opacity={0.3}
          rotation={[0, 0, -roll]}
        />
        <Circle
          color="orange"
          thetaLength={roll % (Math.PI * 2)}
          roll={-roll % (Math.PI * 2)}
          opacity={0.3}
        />
        <Text
          text={`roll: ${roll}`}
          position={DEFAULT_RIGHT.map(val => val * 2.4)}
          color="orange"
          align="center"
          size={0.2}
          billboard
        />
        <GLTF
          gltfPath="gltf/"
          gltfURL="flamingo.glb"
          scale={[0.02, 0.02, 0.02]}
          castShadow
          receiveShadow
        />
        <Axis xColor="magenta" yColor="cyan" zColor="yellow" />
      </Group>
      <Text
        text="Rotation"
        position={[0, 6, 0]}
        size={0.3}
        align="center"
        color="black"
      />
      <Ground />
    </View3D>
  );
};

Rotation.args = {
  quaternion: [],
  rotation: [0, 0, 0],
  normal: [0, 0, 1],
  roll: 0,
};

Rotation.argTypes = {
  quaternion: {
    control: { type: 'object' },
    description: 'Quaternion rotation values',
    defaultValue: [],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Euler rotation values',
    defaultValue: [0, 0, 0],
  },
  normal: {
    control: { type: 'object' },
    description: 'Normal vector',
    defaultValue: [0, 0, 1],
  },
  roll: {
    control: { type: 'number' },
    description: 'Roll angle in radians',
    defaultValue: 0,
  },
};

export default Rotation;
