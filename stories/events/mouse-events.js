// mouse-events.js
import React, { useState, useMemo, useRef, memo } from "react";

// standard-view
import View3D from "../../src/views/View3D";
import Label from "../../src/primitives/Label";
import { STORY_STYLE } from "../utils/common";
import { RGBStringToNumber, numberToRGBString } from "../../src/utils/util";
import { boolean } from "@storybook/addon-knobs";

const MouseEventsComponent = memo(function MouseEvents({
  onClickToggle,
  onDoubleClickToggle,
  onPointerDownToggle,
  onPointerUpToggle,
  onPointerOverToggle,
  onPointerOutToggle,
  onPointerMoveToggle,
  onWheelToggle,
  ignoreMouseEventsToggle
}) {
  // Click
  const [clickCount, setClickCount] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const clickText = useMemo(
    function updateClickText() {
      return `Click ${clickCount}    DoubleClick ${doubleClickCount}`;
    },
    [clickCount, doubleClickCount]
  );

  // Hover
  const [hoverText, setHoverText] = useState("Hover");

  // Move
  const [moveColor, setMoveColor] = useState("RGB(0, 0, 255)");
  function updateRainbow(rainbow, setRainbow) {
    let { r, g, b } = RGBStringToNumber(rainbow);
    r = (r + 1) % 256;
    g = (g + 2) % 256;
    b = (b + 3) % 256;
    setRainbow(numberToRGBString(r, g, b));
  }

  // Up Down
  const [upDownText, setUpDownText] = useState("Click");

  // Wheel
  const [wheelColor, setWheelColor] = useState("RGB(0, 255, 0)");

  // Custom
  const lastCustomActivity = useRef(Date.now());
  const [customClickCount, setCustomClickCount] = useState(0);
  const [customDoubleClickCount, setCustomDoubleClickCount] = useState(0);
  const [customText, setCustomText] = useState("Custom");
  const [customColor, setCustomColor] = useState("RGB(0, 0, 0)");
  function customReset() {
    lastCustomActivity.current = Date.now();
    setTimeout(() => {
      if (Date.now() - lastCustomActivity.current >= 5000) {
        setCustomText("Custom");
        setCustomColor("RGB(0, 0, 0)");
      }
    }, 5000);
  }

  return (
    <View3D style={STORY_STYLE}>
      {/* Click Test */}
      <Label
        position={[0, 1, 0]}
        resolution={256}
        align="center"
        text={clickText}
        textColor="white"
        backgroundColor="gray"
        onClick={() => setClickCount(c => c + 1)}
        onDoubleClick={() => setDoubleClickCount(c => c + 1)}
      />
      {/* Hover Test */}
      <Label
        position={[-3, 0, 0]}
        resolution={256}
        text={hoverText}
        textColor="black"
        backgroundColor="orange"
        onPointerOver={() => setHoverText("Over")}
        onPointerOut={() => setHoverText("Out")}
      />
      {/* Up Down Test */}
      <Label
        position={[-1, 0, 0]}
        resolution={256}
        text={upDownText}
        textColor="black"
        backgroundColor="yellow"
        onPointerDown={() => setUpDownText("Down")}
        onPointerUp={() => setUpDownText("Up")}
      />
      {/* Wheel Test */}
      <Label
        position={[1, 0, 0]}
        resolution={256}
        text="Wheel"
        textColor="black"
        backgroundColor={wheelColor}
        onWheel={() => updateRainbow(wheelColor, setWheelColor)}
      />
      {/* Move Test */}
      <Label
        position={[3, 0, 0]}
        resolution={256}
        text="Move"
        textColor="white"
        backgroundColor={moveColor}
        onPointerMove={() => updateRainbow(moveColor, setMoveColor)}
      />
      {/* Custom */}
      <Label
        position={[0, -1.5, 0]}
        scale={[2, 2, 1]}
        resolution={256}
        text={customText}
        textColor="white"
        backgroundColor={customColor}
        onClick={
          onClickToggle
            ? () => {
                setCustomClickCount(c => c + 1);
                setCustomText(`Click ${customClickCount}`);
                customReset();
              }
            : undefined
        }
        onDoubleClick={
          onDoubleClickToggle
            ? () => {
                setCustomDoubleClickCount(c => c + 1);
                setCustomText(`Double Click ${customDoubleClickCount}`);
                customReset();
              }
            : undefined
        }
        onPointerDown={
          onPointerDownToggle
            ? () => {
                setCustomText("Down");
                customReset();
              }
            : undefined
        }
        onPointerUp={
          onPointerUpToggle
            ? () => {
                setCustomText("Up");
                customReset();
              }
            : undefined
        }
        onPointerOver={
          onPointerOverToggle ? () => setCustomText("Over") : undefined
        }
        onPointerOut={
          onPointerOutToggle
            ? () => {
                setCustomText("Out");
                customReset();
              }
            : undefined
        }
        onPointerMove={
          onPointerMoveToggle
            ? () => {
                setCustomText("Move");
                updateRainbow(customColor, setCustomColor);
                customReset();
              }
            : undefined
        }
        onWheel={
          onWheelToggle
            ? () => {
                setCustomText("Wheel");
                updateRainbow(customColor, setCustomColor);
                customReset();
              }
            : undefined
        }
        ignoreMouseEvents={ignoreMouseEventsToggle}
      />
    </View3D>
  );
});

export default function MouseEventsStory() {
  const mouseEventStoryProps = {
    onClickToggle: boolean("onClick", true),
    onDoubleClickToggle: boolean("onDoubleClick", true),
    onPointerDownToggle: boolean("onPointerDown", true),
    onPointerUpToggle: boolean("onPointerUp", true),
    onPointerOverToggle: boolean("onPointerOver", true),
    onPointerOutToggle: boolean("onPointerOut", true),
    onPointerMoveToggle: boolean("onPointerMove", true),
    onWheelToggle: boolean("onWheel", true),
    ignoreMouseEventsToggle: boolean("ignoreMouseEvents", false)
  };

  return <MouseEventsComponent {...mouseEventStoryProps} />;
}
