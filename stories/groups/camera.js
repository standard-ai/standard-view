// camera.js
import React, { useState } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import {
  color as colorPicker,
  text,
  number,
  boolean
} from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, Camera, GLTF } from "../../src";
import { Ground, Light, STORY_STYLE, KNOB_GROUP } from "../utils/common";
import { useFrame } from "../../src/utils/hooks";

function AddControls({ group, scene, camera, gl }): void {
  const controls = new TransformControls(camera, gl.domElement);
  controls.addEventListener("change", gl.render);
  controls.addEventListener("dragging-changed", e => {
    camera.controls.enabled = !e.value;
    return null;
  });
  controls.setMode("rotate");
  controls.attach(group.current);
  scene.add(controls);
}

function Background({ backgroundVis, color, opacity }): null {
  useFrame(function updateRenderLoop({ gl, scene, camera }) {
    if (backgroundVis) {
      scene.cancelTailRender = true;
      if (color) {
        const transparent = opacity < 1;
        scene.overrideMaterial = new THREE.MeshBasicMaterial({
          color,
          opacity,
          transparent,
          depthWrite: false
        });
      }
      gl.render(scene, camera);
      scene.overrideMaterial = null;
    }
  }, 2);

  return null;
}

export default function CameraStory(): React.Node {
  const autoRotate = boolean("autoRotate", false, KNOB_GROUP.VIEW3D);

  // Visible
  const cam1 = boolean("cam1", true, KNOB_GROUP.ENVIRONMENT);
  const cull = boolean("cam1 cull", false, KNOB_GROUP.ENVIRONMENT);
  const cam2 = boolean("cam2", false, KNOB_GROUP.ENVIRONMENT);
  const cull2 = boolean("cam2 cull", false, KNOB_GROUP.ENVIRONMENT);
  const cityVis = boolean("city", true, KNOB_GROUP.ENVIRONMENT);
  const backgroundVis = boolean("background", false, KNOB_GROUP.ENVIRONMENT);

  // Intrinsics
  const INTRINSICS = "Intrinsics";
  const type = text("type", "perspective", INTRINSICS);
  const width = number("width", 1, {}, INTRINSICS);
  const height = number("height", 1, {}, INTRINSICS);
  const left = number("left (orthographic only)", -0.5, {}, INTRINSICS);
  const right = number("right (orthographic only)", 0.5, {}, INTRINSICS);
  const top = number("top (orthographic only)", 0.5, {}, INTRINSICS);
  const bottom = number("bottom (orthographic only)", -0.5, {}, INTRINSICS);
  const near = number("near", 0.000001, {}, INTRINSICS);
  const far = number("far", 1000, {}, INTRINSICS);
  const fov = number("fov (perspective  only)", 50, {}, INTRINSICS);
  const aspect = number(
    "aspect (perspective only)",
    width / height,
    {},
    INTRINSICS
  );
  const intrinsics = {
    type,
    width,
    height,
    left,
    right,
    top,
    bottom,
    near,
    far,
    fov,
    aspect
  };

  // First Camera
  const EXTRINSICS = "Extrinsics";
  const position = numberArray("cam1 position", [-20, -80, 30], 3, EXTRINSICS);
  const target = numberArray("cam1 target", [-8, 0, 0], 3, EXTRINSICS);
  const normal = numberArray("cam1 normal", [], 3, EXTRINSICS);
  const up = numberArray("cam1 up", [0, 0, 1], 3, EXTRINSICS);
  const roll = number("cam1 roll", 0, {}, EXTRINSICS) || undefined;
  const rotation = numberArray("cam1 rotation", [], 3, EXTRINSICS);
  const quaternion = numberArray("cam1 quaternion", [], 4, EXTRINSICS);

  const coverageColorInput = text(
    "cam1 coverageColor (input)",
    "red",
    KNOB_GROUP.MATERIAL
  );
  const coverageColor = colorPicker(
    "cam1 coverageColor",
    coverageColorInput !== "" ? coverageColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const coverageOpacity = number(
    "cam1 coverageOpacity",
    0.5,
    {},
    KNOB_GROUP.MATERIAL
  );
  const helper = boolean("cam1 helper", true, KNOB_GROUP.MATERIAL);
  const showUp = boolean("cam1 showUp", true, KNOB_GROUP.MATERIAL);
  const showNormal = boolean("cam1 showNormal", true, KNOB_GROUP.MATERIAL);
  const showRoll = boolean("cam1 showRoll", true, KNOB_GROUP.MATERIAL);
  const showLabel = boolean("cam1 showLabel", true, KNOB_GROUP.MATERIAL);
  const showLookAt = boolean("cam1 showLookAt", true, KNOB_GROUP.MATERIAL);
  const wireframeColor = text(
    "cam1 wireframeColor",
    "black",
    KNOB_GROUP.MATERIAL
  );

  // Second Camera
  const position2 = numberArray("cam2 position", [80, 2, 30], 3, EXTRINSICS);
  const target2 = numberArray("cam2 target", [], 3, EXTRINSICS);
  const normal2 = numberArray("cam2 normal", [1, 0, 0.3], 3, EXTRINSICS);
  const up2 = numberArray("cam2 up", [0, 1, 0], 3, EXTRINSICS);
  const roll2 = number("cam2 roll", 0, {}, EXTRINSICS) || undefined;
  const rotation2 = numberArray("cam2 rotation", [], 3, EXTRINSICS);
  const quaternion2 = numberArray(
    "cam2 quaternion",
    [0, 0, 0, 1],
    4,
    EXTRINSICS
  );

  const coverageColorInput2 = text(
    "cam2 coverageColor (input)",
    "blue",
    KNOB_GROUP.MATERIAL
  );
  const coverageColor2 = colorPicker(
    "cam2 coverageColor",
    coverageColorInput2 !== "" ? coverageColorInput2 : undefined,
    KNOB_GROUP.MATERIAL
  );
  const coverageOpacity2 = number(
    "cam2 coverageOpacity",
    0.5,
    {},
    KNOB_GROUP.MATERIAL
  );
  const helper2 = boolean("cam2 helper", true, KNOB_GROUP.MATERIAL);
  const showUp2 = boolean("cam2 showUp", true, KNOB_GROUP.MATERIAL);
  const showNormal2 = boolean("cam2 showNormal", true, KNOB_GROUP.MATERIAL);
  const showRoll2 = boolean("cam2 showRoll", true, KNOB_GROUP.MATERIAL);
  const showLabel2 = boolean("cam2 showLabel", true, KNOB_GROUP.MATERIAL);
  const showLookAt2 = boolean("cam2 showLookAt", true, KNOB_GROUP.MATERIAL);
  const wireframeColor2 = text(
    "cam2 wireframeColor",
    "black",
    KNOB_GROUP.MATERIAL
  );

  // Background
  const backgroundColorInput = text(
    "background color (input)",
    "gray",
    KNOB_GROUP.MATERIAL
  );
  const backgroundColor = colorPicker(
    "background color",
    backgroundColorInput !== "" ? backgroundColorInput : undefined,
    KNOB_GROUP.MATERIAL
  );
  const backgroundOpacity = number(
    "background opacity",
    0.5,
    {},
    KNOB_GROUP.MATERIAL
  );

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

  return (
    <View3D
      orbitControls
      orthographic
      camera={{
        position: [-200, -800, 300],
        up: [0, 0, 1],
        zoom: 50,
        far: 1000000
      }}
      shadowMapEnabled
      style={STORY_STYLE}
      controls={{ autoRotate }}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      <Light position={[3, 3, 10]} />
      {cam1 && (
        <Camera
          {...intrinsics}
          onDoubleClick={AddControls}
          position={position}
          normal={normal}
          target={target}
          rotation={rotation}
          up={up}
          roll={roll}
          quaternion={quaternion}
          labelText="Cam 1"
          helper={helper}
          showLabel={showLabel}
          showUp={showUp}
          showNormal={showNormal}
          showRoll={showRoll}
          showLookAt={showLookAt}
          cull={cull}
          coverageColor={coverageColor}
          coverageOpacity={coverageOpacity}
          hoverColor={hoverColor}
          wireframeColor={wireframeColor}
          scale={[4, 4, 4]}
        />
      )}
      {cam2 && (
        <Camera
          {...intrinsics}
          onDoubleClick={AddControls}
          position={position2}
          normal={normal2}
          target={target2}
          rotation={rotation2}
          quaternion={quaternion2}
          up={up2}
          roll={roll2}
          labelText="Cam 2"
          helper={helper2}
          showLabel={showLabel2}
          showUp={showUp2}
          showNormal={showNormal2}
          showRoll={showRoll2}
          showLookAt={showLookAt2}
          cull={cull2}
          coverageColor={coverageColor2}
          coverageOpacity={coverageOpacity2}
          hoverColor={hoverColor}
          wireframeColor={wireframeColor2}
          scale={[4, 4, 4]}
        />
      )}
      <Ground
        position={[0, 0, -5]}
        rotation={[0, 0, 0]}
        visible={!cityVis}
        opacity={0.8}
      />
      <GLTF
        gltfPath="gltf/"
        gltfURL="tokyo.glb"
        rotation={[Math.PI * 0.5, 0, 0]}
        position={[0, 0, 58.5]}
        scale={[0.3, 0.3, 0.3]}
        visible={cityVis}
      />
      <Background
        backgroundVis={backgroundVis}
        color={backgroundColor}
        opacity={backgroundOpacity}
      />
    </View3D>
  );
}
