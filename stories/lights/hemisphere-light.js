// hemisphere-light.js
import React from "react";
import { color, text, number, boolean } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import { view3DProps, Ground, Balls, KNOB_GROUP } from "../utils/common";

// standard-view
import { View3D, HemisphereLight } from "../../src";

export default function HemisphereLightStory(): React.ReactNode {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const skyColorInput = text(
    "skyColor (input)",
    "lightskyblue",
    KNOB_GROUP.ENVIRONMENT
  );
  const skyColor = color(
    "skyColor",
    skyColorInput !== "" ? skyColorInput : undefined,
    KNOB_GROUP.ENVIRONMENT
  );
  const groundColorInput = text(
    "groundColor (input)",
    "sandybrown",
    KNOB_GROUP.ENVIRONMENT
  );
  const groundColor = color(
    "groundColor",
    groundColorInput !== "" ? groundColorInput : undefined,
    KNOB_GROUP.ENVIRONMENT
  );

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Balls />
      <Ground materialType="standard" />
      <HemisphereLight
        position={numberArray("position", [0, 1, 0], 3, KNOB_GROUP.ENVIRONMENT)}
        skyColor={skyColor}
        groundColor={groundColor}
        intensity={number("intensity", 1, {}, KNOB_GROUP.ENVIRONMENT)}
        helperSize={number("helperSize", 1, {}, KNOB_GROUP.ENVIRONMENT)}
        helper={boolean("helper", true, KNOB_GROUP.ENVIRONMENT)}
      />
    </View3D>
  );
}
