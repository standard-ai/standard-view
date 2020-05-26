// axis.js
import React from "react";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";
import { view3DProps, KNOB_GROUP } from "../utils/common";

// standard-view
import { View3D, Axis } from "../../src";

export default function AxisStory(): React.Node {
  // View3D
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);

  // Material
  const colorInputX = text("xColor (input)", "red", KNOB_GROUP.MATERIAL);
  const xColor = colorPicker(
    "xColor",
    colorInputX !== "" ? colorInputX : "red",
    KNOB_GROUP.MATERIAL
  );
  const colorInputY = text("yColor (input)", "blue", KNOB_GROUP.MATERIAL);
  const yColor = colorPicker(
    "yColor",
    colorInputY !== "" ? colorInputY : "blue",
    KNOB_GROUP.MATERIAL
  );
  const colorInputZ = text("zColor (input)", "lime", KNOB_GROUP.MATERIAL);
  const zColor = colorPicker(
    "zColor",
    colorInputZ !== "" ? colorInputZ : "lime",
    KNOB_GROUP.MATERIAL
  );

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Axis
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        x={numberArray("x", [1, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        y={numberArray("y", [0, 1, 0], 3, KNOB_GROUP.GEOMETRY)}
        z={numberArray("z", [0, 0, 1], 3, KNOB_GROUP.GEOMETRY)}
        xLabel={text("xLabel", "x", KNOB_GROUP.MATERIAL)}
        yLabel={text("yLabel", "y", KNOB_GROUP.MATERIAL)}
        zLabel={text("zLabel", "z", KNOB_GROUP.MATERIAL)}
        xColor={xColor}
        yColor={yColor}
        zColor={zColor}
        labelSize={number("labelSize", 0.2, {}, KNOB_GROUP.GEOMETRY)}
        labelHeight={number("labelHeight", 0.02, {}, KNOB_GROUP.GEOMETRY)}
        labelRotation={numberArray(
          "labelRotation",
          [0, 0, 0],
          3,
          KNOB_GROUP.GEOMETRY
        )}
        thickness={number("thickness", 0.1, {}, KNOB_GROUP.GEOMETRY)}
      />
    </View3D>
  );
}
