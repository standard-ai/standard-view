// obj.js
import React, { useState, useCallback } from "react";
import { text, number, boolean } from "@storybook/addon-knobs";
import Mousetrap from "mousetrap";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, OBJ, AmbientLight, Sphere, SpotLight, Group } from "../../src";
import { Ground, KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";
import * as THREE from "three";

const V = KNOB_GROUP.VIEW3D;
const E = KNOB_GROUP.ENVIRONMENT;
const G = KNOB_GROUP.GEOMETRY;
const M = KNOB_GROUP.MATERIAL;

function OBJComponent({ autoRotate, ornamentProps }: any): React.ReactNode {
  // Ornament
  const Ornament = useCallback(
    function Ornament(props: any): React.ReactNode {
      return (
        <Sphere
          materialType="standard"
          roughness={0.2}
          metalness={0.8}
          view3DEnvMap
          {...ornamentProps}
          {...props}
        />
      );
    },
    [ornamentProps]
  );

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, 0, 20],
        target: [0, 6.5, 0],
        up: [0, 1, 0]
      }}
      orbitControls
      style={{ height: "stretch", width: "stretch", minHeight: "80vh" }}
      controls={{ autoRotate, maxPolarAngle: Math.PI * 0.5 }}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
      backgroundEquirectangularTextureURL="backgrounds/snow-mountains2.jpg"
    >
      {/* Ground */}
      <Ground color="white" materialType="phong" />

      {/* Lights */}
      <AmbientLight intensity={number("AmbientLight intensity", 0.3, {}, E)} />
      <SpotLight
        position={[-10, 20, 15]}
        intensity={number("Spot Light intensity", 0.7, {}, E)}
        decay={0.3}
        angle={Math.PI * 0.8}
        penumbra={0.8}
        castShadow
      />

      {/* OBJ */}
      <Group
        position={numberArray("Group position", [0, 0, 0], 3, G)}
        scale={numberArray("Group scale", [1, 1, 1], 3, G)}
        rotation={numberArray("Group rotation", [0, 0, 0], 3, G)}
        normal={numberArray("Group normal", DEFAULT_NORMAL, 3, G)}
        roll={number("Group roll", 0, {}, G)}
      >
        <OBJ
          position={numberArray("Santa Hat position", [0, 6.8, 0], 3, G)}
          scale={numberArray("Santa Hat scale", [0.2, 0.2, 0.2], 3, G)}
          rotation={numberArray(
            "Santa Hat rotation",
            [0, Math.PI * 0.5, 0],
            3,
            G
          )}
          normal={numberArray("Santa Hat normal", DEFAULT_NORMAL, 3, G)}
          roll={number("Santa Hat roll", 0, {}, G)}
          castShadow={boolean("Santa Hat castShadow", true, M)}
          visible={boolean("Santa Hat visible", true, M)}
          objPath={text("Santa Hat objPath", "/obj-mtl/santa-hat/", M)}
          objURL={text("Santa Hat objURL", "santa-hat.obj", M)}
          mtlPath={text("Santa Hat mtlPath", "/obj-mtl/santa-hat/", M)}
          mtlURL={text("Santa Hat mtlURL", "santa-hat.mtl", M)}
        />
        <OBJ
          position={numberArray("Tree position", [0, -0.9, 0], 3, G)}
          scale={numberArray("Tree scale", [0.3, 0.3, 0.3], 3, G)}
          rotation={numberArray("Tree rotation", [0, 0, 0], 3, G)}
          normal={numberArray("Tree normal", DEFAULT_NORMAL, 3, G)}
          roll={number("Tree roll", 0, {}, G)}
          castShadow={boolean("Tree castShadow", true, M)}
          visible={boolean("Tree visible", true, M)}
          objPath={text("Tree objPath", "/obj-mtl/christmas-tree/", M)}
          objURL={text("Tree objURL", "christmas-tree.obj", M)}
          mtlPath={text("Tree mtlPath", "/obj-mtl/christmas-tree/", M)}
          mtlURL={text("Tree mtlURL", "christmas-tree.mtl", M)}
        />
        {/* Ornaments */}
        <Ornament position={[-1.1, 5.5, 0]} color="white" />
        <Ornament position={[1.5, 5, 0]} color="red" />
        <Ornament position={[-1, 4.3, 1.3]} color="gold" />
        <Ornament
          position={[0, 3, -2]}
          color="white"
          textureURL="textures/ornament2.png"
          roughness={0.2}
          metalness={0.3}
        />
        <Ornament position={[0, 3, 2]} color="blue" />
        <Ornament position={[-1.9, 2.6, -1]} color="green" />
        <Ornament position={[2.3, 2.5, 0]} color="green" />
        <Ornament
          position={[-1.8, 2, 1.8]}
          color="white"
          textureURL="textures/ornament.png"
          roughness={0.2}
          metalness={0.3}
        />
        <Ornament position={[-2, 1, -2]} color="red" />
        <Ornament position={[2.2, 0.8, 2]} color="white" />
        <Ornament position={[2.2, 0.9, -1.8]} color="cyan" />
      </Group>
    </View3D>
  );
}

function OBJStory(): React.ReactNode {
  const autoRotate = boolean("autoRotate", true, V);

  const ornamentScale = numberArray(
    "Ornaments scale",
    [0.4, 0.4, 0.4],
    3,
    G
  ) || [0.4, 0.4, 0.4];
  const ornamentVisible = boolean("Ornaments visible", true, M);
  const ornamentCastShadow = boolean("Ornaments castShadow", true, M);
  const ornamentProps = {
    scale: ornamentScale,
    visible: ornamentVisible,
    castShadow: ornamentCastShadow
  };

  const props = {
    autoRotate,
    ornamentProps
  };

  return <OBJComponent {...props} />;
}

export default OBJStory;
