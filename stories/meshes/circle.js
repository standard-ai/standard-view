// circle.js
import React from "react";
import {
  color as colorPicker,
  text,
  boolean,
  number
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import View3D from "../../src/views/View3D";
import Circle from "../../src/primitives/Circle";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

export function CircleComponent(props): React.ReactNode {
  const { autoRotate, ...circleProps } = props;
  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Circle {...circleProps} />
    </View3D>
  );
}

export default function CircleStory(): React.ReactNode {
  // View3D
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);

  // Geometry
  const position = numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY);
  const radius = number("radius", 1, {}, KNOB_GROUP.GEOMETRY);
  const scale = numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY);
  const rotation = numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY);
  const normal = numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY);
  const roll = number("roll", 0, {}, KNOB_GROUP.GEOMETRY);
  const segments = number("segments", 32, {}, KNOB_GROUP.GEOMETRY) || 0;
  const thetaStart = number("thetaStart", 0, {}, KNOB_GROUP.GEOMETRY) || 0;
  const thetaLength =
    number("thetaLength", Math.PI * 2, {}, KNOB_GROUP.GEOMETRY) || 0;

  // Material
  const colorInput = text("color (input)", "yellow", KNOB_GROUP.MATERIAL);
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
  const opacity = number("opacity", 1, {}, KNOB_GROUP.MATERIAL);
  const side = text("side", "double", KNOB_GROUP.MATERIAL);
  const materialType = text("materialType", "basic", KNOB_GROUP.MATERIAL);
  const castShadow = boolean("castShadow", true, KNOB_GROUP.MATERIAL);
  const wireframe = boolean("wireframe", false, KNOB_GROUP.MATERIAL);

  const props = {
    autoRotate,
    color,
    hoverColor,
    hoverable,
    position,
    scale,
    rotation,
    normal,
    roll,
    radius,
    segments,
    thetaStart,
    thetaLength,
    opacity,
    side,
    materialType,
    castShadow,
    wireframe
  };

  return <CircleComponent {...props} />;
}
