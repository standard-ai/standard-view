// path.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean,
  object
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import View3D from "../../src/views/View3D";
import Path from "../../src/groups/Path";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";

function PathComponent({
  autoRotate,
  points,
  hoverColor,
  pointColor,
  lineColor,
  materialType,
  thickness,
  lineThickness,
  pointRadius,
  point,
  frame,
  enumerate
}: any): React.Node {
  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Ground />
      <Light />
      <Path
        points={points}
        hoverColor={hoverColor}
        lineColor={lineColor}
        pointColor={pointColor}
        thickness={thickness}
        lineThickness={lineThickness}
        pointRadius={pointRadius}
        point={point}
        frame={frame}
        materialType={materialType}
        enumerate={enumerate}
      />
    </View3D>
  );
}

export default function PathStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.ENVIRONMENT);
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
  const pointColorInput = text(
    "pointColor (input)",
    "red",
    KNOB_GROUP.MATERIAL
  );
  const pointColor = colorPicker(
    "pointColor",
    pointColorInput !== "" ? pointColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const lineColorInput = text("lineColor (input)", "lime", KNOB_GROUP.MATERIAL);
  const lineColor = colorPicker(
    "lineColor",
    lineColorInput !== "" ? lineColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const materialType = text("materialType", "physical", KNOB_GROUP.MATERIAL);
  const thickness = number("thickness", 0.1, {}, KNOB_GROUP.GEOMETRY);
  const pointRadius = number("pointRadius", 0.2, {}, KNOB_GROUP.GEOMETRY);
  const lineThickness = number("lineThickness", 0.1, {}, KNOB_GROUP.GEOMETRY);
  const points = object(
    "points",
    [[0, 0, 0], [1, 0, 0], [2, 1, 0]],
    KNOB_GROUP.GEOMETRY
  );

  const props = {
    autoRotate,
    points,
    hoverColor,
    pointColor,
    lineColor,
    materialType,
    thickness: thickness || undefined,
    lineThickness,
    pointRadius,
    point: numberArray("point", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY),
    frame: number("frame", 0, {}, KNOB_GROUP.GEOMETRY),
    enumerate: boolean("enumerate", false, KNOB_GROUP.MATERIAL)
  };

  return <PathComponent {...props} />;
}
