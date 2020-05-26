// damaged-helmet.js
import React from "react";
import { boolean, select } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import * as THREE from "three";

// standard-view
import { View3D, GLTF } from "../../src";
import { KNOB_GROUP } from "../utils/common";

export default function DamagedHelmetStory(): React.Node {
  // Auto Rotate
  const autoRotate = boolean("autoRotate", true, "View3D");

  // Backgrounds
  const backgrounds = {
    store: "backgrounds/store.jpg",
    manga: "backgrounds/manga.jpg",
    croatia: "backgrounds/croatia.jpg",
    overpass: "backgrounds/overpass.hdr",
    modernRoom: "backgrounds/modern-room.jpg",
    snow: "backgrounds/snow.jpg",
    fridge: "backgrounds/fridge.png",
    drawingRoom: "backgrounds/drawingroom.jpg",
    snowMountains: "backgrounds/snow-mountains.jpg",
    pattern: "backgrounds/pattern.jpg"
  };
  const background = select(
    "background",
    backgrounds,
    backgrounds.overpass,
    "View3D"
  );
  const RGBE = background === backgrounds.overpass;

  // Geometry
  const scale = numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY);
  const position = numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY);
  const rotation = numberArray(
    "rotation",
    [Math.PI * 0, Math.PI * 0, 0],
    3,
    KNOB_GROUP.GEOMETRY
  );

  return (
    <View3D
      camera={{
        fov: 45
      }}
      orbitControls
      style={{ height: "stretch", width: "stretch", minHeight: "80vh" }}
      controls={{ autoRotate }}
      backgroundEquirectangularRGBEURL={RGBE ? background : undefined}
      backgroundEquirectangularTextureURL={background}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      <GLTF
        position={position}
        rotation={rotation}
        scale={scale}
        gltfPath="gltf/damaged-helmet/"
        gltfURL="DamagedHelmet.gltf"
        dracoDecoderPath="gltf/draco-decoders/"
        view3DEnvMap
      />
    </View3D>
  );
}
