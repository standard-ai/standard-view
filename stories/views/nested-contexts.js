// ManyMeshesContext.js - Tests updating context data for n element
import React, { createContext, memo, useContext, useState } from "react";
// standard-view
import View3D from "../../src/views/View3D";
import Box from "../../src/primitives/Box";
import { useAnimationFrame } from "../../src/utils";
import { number } from "@storybook/addon-knobs";

export default function NestedContextStory() {
  const CONTEXT_COUNT = number("Contexts", 50);
  const Contexts = Array(CONTEXT_COUNT)
    .fill()
    .map(() => createContext(0));

  // This increments the rotation angle continuosly for the Context and should
  // propagate to all children using the same Context
  const AppContext = ({ i, children }) => {
    const [rotation, setRotation] = useState(0);
    const floorSqrtContext = Math.floor(Math.sqrt(CONTEXT_COUNT));

    const [spinSpeed] = useState(i * 0.0002);
    // Update the rotation to add a bit on each update
    useAnimationFrame(() => {
      setRotation(r => (r + spinSpeed) % (2 * Math.PI));
    }, [setRotation]);
    const Context = Contexts[i];
    return <Context.Provider value={rotation}>{children}</Context.Provider>;
  };

  const AppContexts = ({ children }) => {
    return Array(CONTEXT_COUNT)
      .fill()
      .reduce(
        (child, current, i) => <AppContext i={i}>{child}</AppContext>,
        children
      );
  };

  const RotatingBoxes = memo(() => {
    return Array(CONTEXT_COUNT)
      .fill()
      .map((_, i) => <RotatingBox key={i} i={i} />);
  });

  // It does rotate at the same time/speed as the DIV
  const RotatingBox = ({ i }) => {
    const rotation = useContext(Contexts[i]);
    const floorSqrtContext = Math.floor(Math.sqrt(CONTEXT_COUNT));
    const floorCenterSqrtContext = Math.floor(
      CONTEXT_COUNT / Math.sqrt(CONTEXT_COUNT) / 2
    );

    return (
      <group
        position={[
          (i % floorSqrtContext) - floorCenterSqrtContext,
          parseInt(i / floorSqrtContext) - floorCenterSqrtContext,
          0
        ]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, rotation, -rotation]}
      >
        <Box color="black" />
      </group>
    );
  };

  // The 3d canvas-based implementation that should follow the 2d one
  const App3D = memo(() => {
    console.log("App3D renders only once");
    return (
      <View3D orbitControls contexts={Contexts}>
        <RotatingBoxes />
      </View3D>
    );
  });

  return (
    <AppContexts>
      <div style={{ height: "100vh" }}>
        <App3D />
      </div>
    </AppContexts>
  );
}
