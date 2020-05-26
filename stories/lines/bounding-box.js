// bounding-box.js
import React from "react";
import { boolean, text, color } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import { Light, Ground, view3DProps, KNOB_GROUP } from "../utils/common";

// standard-view
import { View3D, BoundingBox } from "../../src";

export default function BoundingBoxStory(): React.Node {
  const autoRotate = boolean("autoRotate", false, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "lime", KNOB_GROUP.MATERIAL);
  const colorPicker = color(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.MATERIAL
  );

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground />
      <BoundingBox
        min={numberArray("min", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        max={numberArray("max", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        color={colorPicker}
        castShadow={boolean("castShadow", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
