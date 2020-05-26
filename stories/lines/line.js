// line.js
import React from "react";
import {
  color as colorPicker,
  text,
  boolean,
  object
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import { Light, Ground, view3DProps, KNOB_GROUP } from "../utils/common";

// standard-view
import View3D from "../../src/views/View3D";
import Line from "../../src/primitives/Line";

export default function LineStory(): React.Node {
  const autoRotate = boolean("autoRotate", false, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "red", KNOB_GROUP.MATERIAL);
  const color = colorPicker(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.MATERIAL
  );

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground />
      <Line
        start={numberArray("start", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        end={numberArray("end", [1, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        points={object("points", [], KNOB_GROUP.GEOMETRY)}
        color={color}
        hoverColor="yellow"
        castShadow={boolean("castShadow", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
