// rect-area-light.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import { view3DProps, Ground, Balls, KNOB_GROUP } from "../utils/common";

// standard-view
import { View3D, RectAreaLight } from "../../src";

export default function RectAreaLightStory(): React.ReactNode {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "white", KNOB_GROUP.ENVIRONMENT);
  const color = colorPicker(
    "color",
    colorInput !== "" ? colorInput : undefined,
    KNOB_GROUP.ENVIRONMENT
  );

  return (
    <View3D shadowMapEnabled {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="standard" roughness={0} metalness={0} />
      <RectAreaLight
        position={numberArray("position", [5, 3, 2], 3, KNOB_GROUP.ENVIRONMENT)}
        target={numberArray("target", [0, 0, 0], 3, KNOB_GROUP.ENVIRONMENT)}
        color={color}
        intensity={number("intensity", 5, {}, KNOB_GROUP.ENVIRONMENT)}
        width={number("width", 3, {}, KNOB_GROUP.ENVIRONMENT)}
        height={number("height", 3, {}, KNOB_GROUP.ENVIRONMENT)}
        helper={boolean("helper", true, KNOB_GROUP.ENVIRONMENT)}
      />
    </View3D>
  );
}
