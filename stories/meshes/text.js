// label.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, Text } from "../../src";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

export default function TextStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const alignText = text("align", "bottom-left", KNOB_GROUP.MATERIAL);
  const align = alignText !== "" ? alignText : null;
  const colorInput = text("color (input)", "red", KNOB_GROUP.MATERIAL);
  const color = colorPicker(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const hoverColorInput = text(
    "hoverColor (input)",
    "yellow",
    KNOB_GROUP.MATERIAL
  );
  const hoverColor = colorPicker(
    "hoverColor",
    hoverColorInput !== "" ? hoverColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const hoverable = boolean("hoverable", true, KNOB_GROUP.MATERIAL);

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Text
        text={text("text", "Text", KNOB_GROUP.MATERIAL)}
        fontName={text("fontName", "helvetiker", KNOB_GROUP.MATERIAL)}
        fontFile={text("fontFile", "", KNOB_GROUP.MATERIAL)}
        size={number("size", 1, {}, KNOB_GROUP.GEOMETRY)}
        height={number("height", 0.01, {}, KNOB_GROUP.GEOMETRY)}
        align={align}
        curveSegments={number("curveSegments", 12, {}, KNOB_GROUP.MATERIAL)}
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        normal={numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        color={color}
        hoverColor={hoverColor}
        hoverable={hoverable}
        opacity={number("opacity", 1, {}, KNOB_GROUP.MATERIAL)}
        side={text("side", "double", KNOB_GROUP.MATERIAL)}
        materialType={text("materialType", "basic", KNOB_GROUP.MATERIAL)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.MATERIAL)}
        wireframe={boolean("wireframe", false, KNOB_GROUP.MATERIAL)}
        billboard={boolean("billboard", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
