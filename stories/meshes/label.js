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
import { View3D, Label } from "../../src";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

export default function LabelStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const alignText = text("align", "center", KNOB_GROUP.MATERIAL);
  const align = alignText !== "" ? alignText : null;
  const textColorInput = text(
    "textColor (input)",
    "white",
    KNOB_GROUP.MATERIAL
  );
  const textColor = colorPicker(
    "textColor",
    textColorInput !== "" ? textColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const backgroundColorInput = text(
    "backgroundColor (input)",
    "black",
    KNOB_GROUP.MATERIAL
  );
  const backgroundColor = colorPicker(
    "backgroundColor",
    backgroundColorInput !== "" ? backgroundColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const noBackground = boolean("noBackground", false, KNOB_GROUP.MATERIAL);
  const borderColorInput = text(
    "borderColor (input)",
    "white",
    KNOB_GROUP.MATERIAL
  );
  const borderColor = colorPicker(
    "borderColor",
    borderColorInput !== "" ? borderColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const borderThickness = number(
    "borderThickness",
    10,
    {},
    KNOB_GROUP.MATERIAL
  );
  const noBorder = boolean("noBorder", false, KNOB_GROUP.MATERIAL);
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

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Label
        text={text("text", "Label", KNOB_GROUP.MATERIAL) || undefined}
        fontName={text("fontName", "sans-serif", KNOB_GROUP.MATERIAL)}
        fontStyle={text("fontStyle", "", KNOB_GROUP.MATERIAL)}
        textColor={textColor}
        backgroundColor={backgroundColor}
        noBackground={noBackground}
        borderColor={borderColor}
        borderThickness={borderThickness}
        noBorder={noBorder}
        resolution={number("resolution", 32, {}, KNOB_GROUP.MATERIAL)}
        align={align}
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        normal={numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
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
