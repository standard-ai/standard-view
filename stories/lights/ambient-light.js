// ambient-light.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { view3DProps, Ground, Balls, KNOB_GROUP } from "../utils/common";

// standard-view
import { View3D, AmbientLight } from "../../src";

export default function AmbientLightStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "white", KNOB_GROUP.ENVIRONMENT);
  const color = colorPicker(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.ENVIRONMENT
  );
  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground />
      <AmbientLight
        color={color}
        intensity={number("Intensity", 1, {}, KNOB_GROUP.ENVIRONMENT)}
      />
    </View3D>
  );
}
