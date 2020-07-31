// fbx.js
import React from "react";
import { number, boolean, text, select } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import * as THREE from "three";

// standard-view
import {
  View3D,
  FBX,
  AmbientLight,
  SpotLight,
  DirectionalLight
} from "../../src";
import { KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

export default function FBXStory(): React.Node {
  // Auto Rotate
  const autoRotate = boolean("autoRotate", false, KNOB_GROUP.VIEW3D);

  // FBX Model
  const models = {
    sophia: "sophia.fbx",
    samba: "samba.fbx"
  };
  const fbxURL = select("fbxURL", models, models.sophia, KNOB_GROUP.MATERIAL);

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, 20, 50],
        far: 10000
      }}
      backgroundEquirectangularTextureURL="backgrounds/store.jpg"
      orbitControls
      style={{ height: "stretch", width: "stretch", minHeight: "80vh" }}
      controls={{ autoRotate, enableZoom: false }}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      {/* Lights */}
      <SpotLight intensity={0.7} color="cyan" position={[0, 100, 100]} />
      <SpotLight intensity={0.4} color="cyan" position={[0, 100, -100]} />
      <SpotLight intensity={0.7} color="snow" position={[0, 100, 100]} />
      <SpotLight intensity={0.4} color="snow" position={[0, 100, -100]} />
      <SpotLight intensity={0.6} color="tan" position={[0, 100, -100]} />
      <SpotLight intensity={0.3} color="tan" position={[0, 100, 100]} />
      <DirectionalLight intensity={0.3} position={[0, 1, 0]} />
      <AmbientLight intensity={0.2} />

      {/* FBX */}
      <FBX
        position={numberArray("position", [0, -150, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray(
          "rotation",
          [fbxURL == models.sophia ? -Math.PI / 2 : 0, 0, 0],
          3,
          KNOB_GROUP.GEOMETRY
        )}
        normal={numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        fbxURL={fbxURL}
        fbxPath={text("fbxPath", "fbx/", KNOB_GROUP.MATERIAL)}
        actionIndex={number("actionIndex", 0, {}, KNOB_GROUP.MATERIAL)}
        visible={boolean("visible", true, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
