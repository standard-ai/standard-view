// cylinder.js
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
import Cylinder from "../../src/primitives/Cylinder";
import { view3DProps, Ground, Light, KNOB_GROUP } from "../utils/common";

export default function CylinderStory(): React.Node {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const colorInput = text("color (input)", "blue", KNOB_GROUP.MATERIAL);
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

  return (
    <View3D {...view3DProps} controls={{ autoRotate }}>
      <Light />
      <Ground position={[0, -4, 0]} />
      <Cylinder
        position={numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        start={numberArray("start", [0, -0.5, 0], 3, KNOB_GROUP.GEOMETRY)}
        end={numberArray("end", [0, 0.5, 0], 3, KNOB_GROUP.GEOMETRY)}
        scale={numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY)}
        rotation={numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY)}
        roll={number("roll", 0, {}, KNOB_GROUP.GEOMETRY)}
        radius={number("radius", 1, {}, KNOB_GROUP.GEOMETRY) || undefined}
        radiusTop={number("radiusTop", 1, {}, KNOB_GROUP.GEOMETRY) || undefined}
        radiusBottom={
          number("radiusBottom", 1, {}, KNOB_GROUP.GEOMETRY) || undefined
        }
        radialSegments={
          number("radialSegments", 32, {}, KNOB_GROUP.GEOMETRY) || undefined
        }
        heightSegments={
          number("heightSegments", 1, {}, KNOB_GROUP.GEOMETRY) || undefined
        }
        openEnded={boolean("openEnded", false, KNOB_GROUP.GEOMETRY)}
        color={color}
        hoverColor={hoverColor}
        hoverable={hoverable}
        opacity={number("opacity", 1, {}, KNOB_GROUP.MATERIAL)}
        side={text("side", "double", KNOB_GROUP.MATERIAL)}
        materialType={text("materialType", "physical", KNOB_GROUP.MATERIAL)}
        castShadow={boolean("castShadow", true, KNOB_GROUP.MATERIAL)}
        wireframe={boolean("wireframe", false, KNOB_GROUP.MATERIAL)}
      />
    </View3D>
  );
}
