// standard-cube.js
import React from "react";

// standard-view
import View3D from "../../src/views/View3D";
import Box from "../../src/primitives/Box";

export default function StandardCube(): React.Node {
  function spin({ state, mesh }) {
    // Euler Rotation over X and Y axes.
    const speed = state.speed == null ? 1 : state.speed;
    state.r = (state.r + 0.01 * speed) % (2 * Math.PI);
    mesh.current.rotation.y = state.r;
    mesh.current.rotation.x = state.r;
  }

  function toggleSpin({ state }) {
    if (state.speed != 0) {
      state.speed = 0;
    } else {
      state.speed = 1;
    }
  }

  return (
    <div className="App">
      Standard Cube
      <View3D
        style={{
          height: "stretch",
          width: "stretch",
          minHeight: "80vh"
        }}
      >
        <Box
          textureURL="/standard-cube/sc.jpg"
          color="white"
          scale={[2, 2, 2]}
          animation={spin}
          state={{ r: 0 }}
          onClick={toggleSpin}
        />
      </View3D>
    </div>
  );
}
