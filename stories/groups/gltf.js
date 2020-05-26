// gltf.js
import React from "react";
import { number, boolean, text } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import * as THREE from "three";

// standard-view
import { View3D, GLTF, AmbientLight, SpotLight } from "../../src";
import { KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

export default function GLTFStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, -100, 1100],
        target: [0, -100, 0],
        up: [0, 1, 0],
        far: 10000
      }}
      orbitControls
      style={{ height: "stretch", width: "stretch", minHeight: "80vh" }}
      controls={{ autoRotate }}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      {/* Lights */}
      <AmbientLight intensity={number("AmbientLight intensity", 0.5)} />
      <SpotLight position={[200, 900, 200]} distance={10000} />

      {/* GLTF */}
      <GLTF
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray(
          "rotation",
          [Math.PI * 0, Math.PI * 0, 0],
          3,
          KNOB_GROUP.GEOMETRY
        )}
        normal={numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        gltfPath={text("gltfPath", "gltf/", KNOB_GROUP.MATERIAL)}
        gltfURL={text("gltfURL", "tokyo.glb", KNOB_GROUP.MATERIAL)}
        dracoDecoderPath={text(
          "dracoDecoderPath",
          // "gltf/draco-decoders/",
          "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/",
          KNOB_GROUP.MATERIAL
        )}
        materialType={text("materialType", "lambert", KNOB_GROUP.MATERIAL)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.MATERIAL)}
        receiveShadow={boolean("receiveShadow", true, KNOB_GROUP.MATERIAL)}
        visible={boolean("visible", true, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
