// damaged-helmet.js
import React from "react";
import { boolean, number, select } from "@storybook/addon-knobs";

// standard-view
import * as THREE from "three";
import { View3D } from "../../src";
import { Balls, Light, view3DProps, KNOB_GROUP } from "../utils/common";

function DamagedHelmetStory(): React.Node {
  // Auto Rotate
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);

  // Backgrounds
  const backgrounds = {
    store: "backgrounds/store.jpg",
    manga: "backgrounds/manga.jpg",
    croatia: "backgrounds/croatia.jpg",
    overpass: "backgrounds/overpass.hdr"
  };
  const background = select(
    "background",
    backgrounds,
    backgrounds.overpass,
    KNOB_GROUP.VIEW3D
  );
  const RGBE = background === backgrounds.overpass;

  // View3D EnvMap
  const view3DEnvMap = boolean("view3DEnvMap", true, KNOB_GROUP.MATERIAL);
  const roughness = number(
    "roughness (physical and standard)",
    0,
    {},
    KNOB_GROUP.MATERIAL
  );
  const metalness = number(
    "metalness (physical and standard)",
    0.5,
    {},
    KNOB_GROUP.MATERIAL
  );
  const reflectivity = number(
    "reflectivity (basic)",
    0.5,
    {},
    KNOB_GROUP.MATERIAL
  );
  const lights = boolean("Lights", true, KNOB_GROUP.MATERIAL);

  return (
    <View3D
      {...view3DProps}
      controls={{ autoRotate }}
      backgroundEquirectangularRGBEURL={RGBE ? background : undefined}
      backgroundEquirectangularTextureURL={background}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      {lights && <Light />}
      <Balls
        roughness={roughness}
        metalness={metalness}
        reflectivity={reflectivity}
        view3DEnvMap={view3DEnvMap}
      />
    </View3D>
  );
}

export default DamagedHelmetStory;
