// controls.js
import React from "react";
import { number, boolean } from "@storybook/addon-knobs";
import { numberArray } from "../utils/story-utils";

// standard-view
import { View3D, Sphere, Axis } from "../../src";

export default function ControlsStory(): React.ReactNode {
  return (
    <View3D
      orbitControls={boolean("orbitControls", false)}
      trackballControls={boolean("trackballControls", false)}
      mapControls={boolean("mapControls", false)}
      camera={{
        position: numberArray("camera.position", [0, 0, 5], 3),
        target: numberArray("camera.target", [0, 0, 0], 3),
        up: numberArray("camera.up", [0, 0, 1], 3),
        rotation: numberArray("camera.rotation", [0, 0, 0], 3)
      }}
      controls={{
        enabled: boolean("controls.enabled", true),
        enableZoom: boolean("controls.enableZoom", true),
        zoomSpeed: number("controls.zoomSpeed", 1),
        minDistance: number("controls.minDistance", 0),
        maxDistance: number("controls.maxDistance", 1000),
        enableRotate: boolean("controls.enableRotate", true),
        rotateSpeed: number("controls.rotateSpeed", 1),
        minPolarAngle: number("controls.minPolarAngle", 0),
        maxPolarAngle: number("controls.maxPolarAngle", Math.PI),
        minAzimuthAngle: number("controls.minAzimuthAngle", -100),
        maxAzimuthAngle: number("controls.maxAzimuthAngle", 100),
        enablePan: boolean("controls.enablePan", true),
        panSpeed: number("controls.panSpeed", 1),
        enableDamping: boolean("controls.enableDamping", false),
        dampingFactor: number("controls.dampingFactor", 0.25),
        autoRotate: boolean("controls.autoRotate", false),
        autoRotateSpeed: number("controls.autoRotateSpeed", 2),
        enableKeys: boolean("controls.enableKeys", true),
        polarAngle: number("controls.polarAngle", 0),
        azimuthAngle: number("controls.azimuthAngle", 0)
        // orthographic={boolean("orthographic", false)} <-- Fix (does not update on change)
      }}
      style={{
        height: "stretch",
        width: "stretch",
        minHeight: "80vh"
      }}
    >
      <Sphere position={[0, 0.75, 0]} color="blue" />
      <Sphere position={[0, -0.75, 0]} color="lightblue" />
      <Sphere position={[0.75, 0, 0]} color="red" />
      <Sphere position={[-0.75, 0, 0]} color="pink" />
    </View3D>
  );
}
