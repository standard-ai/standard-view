// mouse-events.tsx
import React, { useState, useMemo, useRef, memo } from 'react';

// standard-view
import View3D from '../../src/views/View3D';
import Label from '../../src/primitives/Label';
import { STORY_STYLE } from '../utils/common';
import { RGBStringToNumber, numberToRGBString } from '../../src/utils/util';
interface MouseEventsProps {
  onClickToggle: boolean;
  onDoubleClickToggle: boolean;
  onPointerDownToggle: boolean;
  onPointerUpToggle: boolean;
  onPointerOverToggle: boolean;
  onPointerOutToggle: boolean;
  onPointerMoveToggle: boolean;
  onWheelToggle: boolean;
  ignoreMouseEventsToggle: boolean;
}

const MouseEventsComponent = memo(function MouseEvents({
  onClickToggle,
  onDoubleClickToggle,
  onPointerDownToggle,
  onPointerUpToggle,
  onPointerOverToggle,
  onPointerOutToggle,
  onPointerMoveToggle,
  onWheelToggle,
  ignoreMouseEventsToggle,
}: MouseEventsProps) {
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
  const [hoverText, setHoverText] = useState('Hover');

  // Move
  const [moveColor, setMoveColor] = useState('RGB(0, 0, 255)');
  function updateRainbow(rainbow, setRainbow) {
    let { r, g, b } = RGBStringToNumber(rainbow);
    r = (r + 1) % 256;
    g = (g + 2) % 256;
    b = (b + 3) % 256;
    setRainbow(numberToRGBString(r, g, b));
  }

  // Up Down
  const [upDownText, setUpDownText] = useState('Click');

  // Wheel
  const [wheelColor, setWheelColor] = useState('RGB(0, 255, 0)');

  // Custom
  const lastCustomActivity = useRef(Date.now());
  const [customClickCount, setCustomClickCount] = useState(0);
  const [customDoubleClickCount, setCustomDoubleClickCount] = useState(0);
  const [customText, setCustomText] = useState('Custom');
  const [customColor, setCustomColor] = useState('RGB(0, 0, 0)');
  function customReset() {
    lastCustomActivity.current = Date.now();
    setTimeout(() => {
      if (Date.now() - lastCustomActivity.current >= 5000) {
        setCustomText('Custom');
        setCustomColor('RGB(0, 0, 0)');
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
        onPointerOver={() => setHoverText('Over')}
        onPointerOut={() => setHoverText('Out')}
      />
      {/* Up Down Test */}
      <Label
        position={[-1, 0, 0]}
        resolution={256}
        text={upDownText}
        textColor="black"
        backgroundColor="yellow"
        onPointerDown={() => setUpDownText('Down')}
        onPointerUp={() => setUpDownText('Up')}
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
                setCustomText('Down');
                customReset();
              }
            : undefined
        }
        onPointerUp={
          onPointerUpToggle
            ? () => {
                setCustomText('Up');
                customReset();
              }
            : undefined
        }
        onPointerOver={
          onPointerOverToggle ? () => setCustomText('Over') : undefined
        }
        onPointerOut={
          onPointerOutToggle
            ? () => {
                setCustomText('Out');
                customReset();
              }
            : undefined
        }
        onPointerMove={
          onPointerMoveToggle
            ? () => {
                setCustomText('Move');
                updateRainbow(customColor, setCustomColor);
                customReset();
              }
            : undefined
        }
        onWheel={
          onWheelToggle
            ? () => {
                setCustomText('Wheel');
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

const MouseEvents = (args: any = {}): React.ReactElement => {
  const {
    onClick = true,
    onDoubleClick = true,
    onPointerDown = true,
    onPointerUp = true,
    onPointerOver = true,
    onPointerOut = true,
    onPointerMove = true,
    onWheel = true,
    ignoreMouseEvents = false,
  } = args || {};

  const mouseEventStoryProps: MouseEventsProps = {
    onClickToggle: onClick,
    onDoubleClickToggle: onDoubleClick,
    onPointerDownToggle: onPointerDown,
    onPointerUpToggle: onPointerUp,
    onPointerOverToggle: onPointerOver,
    onPointerOutToggle: onPointerOut,
    onPointerMoveToggle: onPointerMove,
    onWheelToggle: onWheel,
    ignoreMouseEventsToggle: ignoreMouseEvents,
  };

  return <MouseEventsComponent {...mouseEventStoryProps} />;
};

MouseEvents.args = {
  onClick: true,
  onDoubleClick: true,
  onPointerDown: true,
  onPointerUp: true,
  onPointerOver: true,
  onPointerOut: true,
  onPointerMove: true,
  onWheel: true,
  ignoreMouseEvents: false,
};

MouseEvents.argTypes = {
  onClick: {
    control: { type: 'boolean' },
    description: 'Enable click events',
    defaultValue: true,
  },
  onDoubleClick: {
    control: { type: 'boolean' },
    description: 'Enable double click events',
    defaultValue: true,
  },
  onPointerDown: {
    control: { type: 'boolean' },
    description: 'Enable pointer down events',
    defaultValue: true,
  },
  onPointerUp: {
    control: { type: 'boolean' },
    description: 'Enable pointer up events',
    defaultValue: true,
  },
  onPointerOver: {
    control: { type: 'boolean' },
    description: 'Enable pointer over events',
    defaultValue: true,
  },
  onPointerOut: {
    control: { type: 'boolean' },
    description: 'Enable pointer out events',
    defaultValue: true,
  },
  onPointerMove: {
    control: { type: 'boolean' },
    description: 'Enable pointer move events',
    defaultValue: true,
  },
  onWheel: {
    control: { type: 'boolean' },
    description: 'Enable wheel events',
    defaultValue: true,
  },
  ignoreMouseEvents: {
    control: { type: 'boolean' },
    description: 'Ignore all mouse events',
    defaultValue: false,
  },
};

export default MouseEvents;
