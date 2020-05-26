// sphere2.js
import React from "react";
import { number } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

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
  Text
} from "../../src";
import { Ground, view3DProps } from "../utils/common";

import { DEFAULT_RIGHT } from "../../src/utils/constants";

function RotationComponent({ rotation, normal, roll, quaternion }) {
  return (
    <View3D
      {...view3DProps}
      camera={{ fov: 75, position: [3, 4, 4], target: [0, 3, 0] }}
    >
      <DirectionalLight castShadow position={[3, 10, 3]} />
      <AmbientLight intensity={0.5} />
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
}

export default function RotationStory() {
  const props = {
    quaternion: numberArray("quaternion", [], 4),
    rotation: numberArray("rotation", [0, 0, 0], 3),
    normal: numberArray("normal", [0, 0, 1], 3),
    roll: number("roll", 0)
  };

  return <RotationComponent {...props} />;
}
