// spot-light.js
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
import { View3D, SpotLight } from "../../src";

export default function RectAreaLightStory(): React.ReactNode {
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
      <Ground materialType="physical" />
      <SpotLight
        position={numberArray("position", [2, 4, 2], 3, KNOB_GROUP.ENVIRONMENT)}
        target={numberArray("target", [0, 0, 0], 3, KNOB_GROUP.ENVIRONMENT)}
        color={color}
        intensity={number("intensity", 1, {}, KNOB_GROUP.ENVIRONMENT)}
        distance={number("distance", 300, {}, KNOB_GROUP.ENVIRONMENT)}
        decay={number("decay", 0.5, {}, KNOB_GROUP.ENVIRONMENT)}
        penumbra={number("penumbra", 0.5, {}, KNOB_GROUP.ENVIRONMENT)}
        angle={number("angle", Math.PI * 0.333, {}, KNOB_GROUP.ENVIRONMENT)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.ENVIRONMENT)}
        helper={boolean("helper", true, KNOB_GROUP.ENVIRONMENT)}
      />
    </View3D>
  );
}
