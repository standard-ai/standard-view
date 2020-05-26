// plane.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean,
  select
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, Plane } from "../../src";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";

export default function PlaneStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "violet", KNOB_GROUP.MATERIAL);
  const color = colorPicker(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const hoverColorInput = text(
    "hoverColor (input)",
    "red",
    KNOB_GROUP.MATERIAL
  );
  const hoverColor = colorPicker(
    "hoverColor",
    hoverColorInput !== "" ? hoverColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const hoverable = boolean("hoverable", true, KNOB_GROUP.MATERIAL);

  const texturePaths = {
    none: "none",
    "backgrounds/": "backgrounds/",
    "standard-cube/": "standard-cube/"
  };
  const texturePathInput = select(
    "texturePath",
    texturePaths,
    texturePaths.none,
    KNOB_GROUP.MATERIAL
  );
  const texturePath =
    texturePathInput !== "none" ? texturePathInput : undefined;
  const textures = {
    none: "none",
    "sc.jpg": "sc.jpg",
    "croatia.jpg": "croatia.jpg",
    "drawingroom.jpg": "drawingroom.jpg",
    "fridge.png": "fridge.png",
    "manga.jpg": "manga.jpg",
    "modern-room.jpg": "modern-room.jpg",
    "space.png": "space.png",
    "pattern.jpg": "pattern.jpg",
    "snow-mountain.jpg": "snow-mountain.jpg",
    "snow-mountain2.jpg": "snow-mountain2.jpg",
    "snow.jpg": "snow.jpg",
    "store.jpg": "store.jpg"
  };
  const textureURLInput = select(
    "textureURL",
    textures,
    textures.none,
    KNOB_GROUP.MATERIAL
  );
  const textureURL = textureURLInput !== "none" ? textureURLInput : undefined;

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Plane
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        normal={numberArray("normal", [0, 0, 1], 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        texturePath={texturePath}
        textureURL={textureURL}
        color={color}
        hoverColor={hoverColor}
        hoverable={hoverable}
        opacity={number("opacity", 1, {}, KNOB_GROUP.MATERIAL)}
        side={text("side", "double", KNOB_GROUP.MATERIAL)}
        materialType={text("materialType", "basic", KNOB_GROUP.MATERIAL)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.MATERIAL)}
        wireframe={boolean("wireframe", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
