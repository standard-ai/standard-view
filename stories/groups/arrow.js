// arrow.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, Arrow, Axis } from "../../src";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";

export default function ArrowStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "magenta", KNOB_GROUP.MATERIAL);
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

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -3, 0]} />
      <Axis thickness={0.03} />
      <Arrow
        tail={numberArray("tail", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        start={numberArray("start", [], 3, KNOB_GROUP.GEOMETRY)}
        position={numberArray("position", [], 3, KNOB_GROUP.GEOMETRY)}
        head={numberArray("head", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        end={numberArray("end", [], 3, KNOB_GROUP.GEOMETRY)}
        target={numberArray("target", [], 3, KNOB_GROUP.GEOMETRY)}
        normal={numberArray("normal", [], 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        magnitude={number("magnitude", 1, {}, KNOB_GROUP.GEOMETRY) || undefined}
        // scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        // headRatio={
        //   number("headRatio", 0.1, {}, KNOB_GROUP.GEOMETRY) || undefined
        // }
        radius={number("radius", 0.05, {}, KNOB_GROUP.GEOMETRY) || undefined}
        // shaftRadius={
        //   number("shaftRadius", 0.05, {}, KNOB_GROUP.GEOMETRY) || undefined
        // }
        // headBaseRadius={
        //   number("headBaseRadius", 0.1, {}, KNOB_GROUP.GEOMETRY) || undefined
        // }
        // headTipRadius={
        //   number("headTipRadius", 0, {}, KNOB_GROUP.GEOMETRY) || undefined
        // }
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        color={color}
        hoverColor={hoverColor}
        hoverable={boolean("hoverable", true, KNOB_GROUP.MATERIAL)}
        opacity={number("opacity", 1, {}, KNOB_GROUP.MATERIAL)}
        side={text("side", "double", KNOB_GROUP.MATERIAL)}
        materialType={text("materialType", "physical", KNOB_GROUP.MATERIAL)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.MATERIAL)}
        wireframe={boolean("wireframe", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
