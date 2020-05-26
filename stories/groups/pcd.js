// pcd.js
import React from "react";
import { number, boolean, text } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, PCD } from "../../src";
import { KNOB_GROUP } from "../utils/common";
import { DEFAULT_NORMAL } from "../../src/utils/constants";

function PCDComponent({
  autoRotate,
  visible,
  pcdPath,
  pcdURL
}: any): React.ReactNode {
  const scale = numberArray("scale", [1, 1, 1], 3, KNOB_GROUP.GEOMETRY);
  const position = numberArray("position", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY);
  const rotation = numberArray("rotation", [0, 0, 0], 3, KNOB_GROUP.GEOMETRY);
  const normal = numberArray("normal", DEFAULT_NORMAL, 3, KNOB_GROUP.GEOMETRY);
  const roll = number("roll", 0, {}, KNOB_GROUP.GEOMETRY);
  const pointSize = number("pointSize", 0.01, {}, KNOB_GROUP.GEOMETRY);

  return (
    <View3D
      camera={{
        fov: 45,
        position: [0, 0, 2],
        up: [0, -1, 0]
      }}
      orbitControls
      style={{ height: "stretch", width: "stretch", minHeight: "80vh" }}
      controls={{ autoRotate }}
    >
      <PCD
        position={position}
        scale={scale}
        rotation={rotation}
        normal={normal}
        roll={roll}
        pcdPath={pcdPath}
        pcdURL={pcdURL}
        visible={visible}
        pointSize={pointSize}
      />
    </View3D>
  );
}

function PCDStory(): React.ReactNode {
  const autoRotate = boolean("autoRotate", true, KNOB_GROUP.VIEW3D);
  const visible = boolean("visible", true, KNOB_GROUP.MATERIAL);
  const pcdPath = text("pcdPath", "pcd/", KNOB_GROUP.MATERIAL);
  const pcdURL = text("pcdURL", "pcl.pcd", KNOB_GROUP.MATERIAL);
  const props = {
    autoRotate,
    visible,
    pcdPath,
    pcdURL
  };

  return <PCDComponent {...props} />;
}

export default PCDStory;
