// group-events.js
import React, { memo } from "react";
import { boolean, text } from "@storybook/addon-knobs";

// standard-view
import View3D from "../../src/views/View3D";
import Label from "../../src/primitives/Label";
import Sphere from "../../src/primitives/Sphere";
import Text from "../../src/primitives/Text";
import Box from "../../src/primitives/Box";
import Group from "../../src/groups/Group";
import { STORY_STYLE, spin } from "../utils/common";

const GroupEventsComponent = memo(function GroupEvents({
  customColor1,
  customHoverColor1,
  customMousePropagation1,
  customIgnoreMouseEvents1,
  customColor2,
  customHoverColor2,
  customMousePropagation2,
  customIgnoreMouseEvents2
}: any) {
  function InnerBox(): React.ReactNode {
    return (
      <Box
        scale={[0.7, 0.7, 0.7]}
        color="magenta"
        hoverColor="yellow"
        animation={spin}
      />
    );
  }
  return (
    <View3D
      orbitControls
      style={STORY_STYLE}
      camera={{ position: [0, 0, 15], fov: 30 }}
    >
      {/* Background */}
      <Label
        position={[0, 0.25, -2]}
        scale={[4, 4, 1]}
        resolution={256}
        text="Yellow onPointerOver"
        backgroundColor="white"
        color="gray"
        textColor="darkgray"
        hoverColor="yellow"
        noBorder
      />
      <Box
        position={[0, -0.75, -1.25]}
        scale={[17, 0.5, 0.2]}
        color="lightgray"
        hoverColor="yellow"
      />

      {/* ignoreMouseEvents */}
      <Sphere
        position={[-7.5, 0, 0]}
        color="cyan"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
        renderOrder={1}
        ignoreMouseEvents
      >
        <Text
          text="ignoreMouseEvents"
          position={[0, 1.1, 0]}
          align="center-bottom"
          size={0.2}
          color="white"
        />
        <Text
          text="As if component"
          position={[0, -2.1, 0]}
          align="center-top"
          size={0.2}
          color="gray"
        />
        <Text
          text="does not exist"
          position={[0, -2.4, 0]}
          align="center-top"
          size={0.2}
          color="gray"
        />
      </Sphere>
      <Sphere
        position={[-7.5, -1, 0]}
        color="orange"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
        ignoreMouseEvents
      >
        <InnerBox />
      </Sphere>

      {/* Mouse Propagation */}
      <Sphere
        position={[-4.5, 0, 0]}
        color="cyan"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
        renderOrder={1}
        mousePropagation
      >
        <Text
          text="mousePropagation"
          position={[0, 1.1, 0]}
          align="center-bottom"
          size={0.2}
          color="white"
        />
        <Text
          text="Mouse events"
          position={[0, -2.1, 0]}
          align="center-top"
          size={0.2}
          color="gray"
        />
        <Text
          text="will propagate through"
          position={[0, -2.4, 0]}
          align="center-top"
          size={0.2}
          color="gray"
        />
        <Text
          text="if objects are behind"
          position={[0, -2.7, 0]}
          align="center-top"
          size={0.2}
          color="gray"
        />
      </Sphere>
      <Sphere
        position={[-4.5, -1, 0]}
        color="orange"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
        mousePropagation
      >
        <InnerBox />
      </Sphere>

      {/* Default */}
      <Sphere
        position={[-1.5, 0, 0]}
        color="cyan"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
        renderOrder={1}
      >
        <Text
          text="default"
          position={[0, 1.1, 0]}
          align="center-bottom"
          size={0.2}
          color="white"
        />
      </Sphere>
      <Sphere
        position={[-1.5, -1, 0]}
        color="orange"
        opacity={0.7}
        hoverColor="yellow"
        depthWrite={false}
      >
        <InnerBox />
      </Sphere>

      {/* Custom */}
      <Sphere
        position={[1.5, 0, 0]}
        color={customColor1}
        opacity={0.7}
        hoverColor={customHoverColor1}
        depthWrite={false}
        renderOrder={1}
        mousePropagation={customMousePropagation1}
        ignoreMouseEvents={customIgnoreMouseEvents1}
      >
        <Text
          text="custom"
          position={[0, 1.1, 0]}
          align="center-bottom"
          size={0.2}
          color="white"
        />
      </Sphere>
      <Sphere
        position={[1.5, -1, 0]}
        color={customColor2}
        opacity={0.7}
        hoverColor={customHoverColor2}
        depthWrite={false}
        mousePropagation={customMousePropagation2}
        ignoreMouseEvents={customIgnoreMouseEvents2}
      >
        <InnerBox />
      </Sphere>

      {/* Group */}
      <Group position={[4.5, 0, 0]} hoverColor="yellow">
        <Sphere
          position={[0, 0, 0]}
          color="cyan"
          hoverColor="black"
          opacity={0.7}
          depthWrite={false}
          renderOrder={1}
          ignoreMouseEvents
        >
          <Text
            text="Group"
            position={[0, 1.1, 0]}
            align="center-bottom"
            size={0.2}
            color="white"
          />
          <Text
            text="No events on child"
            position={[0, -2.1, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
          <Text
            text="automatically sets"
            position={[0, -2.4, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
          <Text
            text="ignoreMouseEvents for child,"
            position={[0, -2.7, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
          <Text
            text="so Group catches all events"
            position={[0, -3.0, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
        </Sphere>
        <Sphere
          position={[0, -1, 0]}
          color="orange"
          opacity={0.7}
          depthWrite={false}
        >
          <InnerBox />
        </Sphere>
      </Group>

      {/* Group with Event */}
      <Group position={[7.5, 0, 0]} hoverColor="yellow">
        <Sphere
          position={[0, 0, 0]}
          color="cyan"
          hoverColor="red"
          opacity={0.7}
          depthWrite={false}
          renderOrder={1}
        >
          <Text
            text="Group"
            position={[0, 1.1, 0]}
            align="center-bottom"
            size={0.2}
            color="white"
          />
          <Text
            text="Cyan Sphere"
            position={[0, -2.1, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
          <Text
            text="Red onPointerOver"
            position={[0, -2.4, 0]}
            align="center-top"
            size={0.2}
            color="gray"
          />
        </Sphere>
        <Sphere
          position={[0, -1, 0]}
          color="orange"
          hoverColor="black"
          opacity={0.7}
          depthWrite={false}
          ignoreMouseEvents
        >
          <InnerBox />
        </Sphere>
      </Group>
    </View3D>
  );
});

export default function GroupEventsStory(): React.ReactNode {
  const groupEventStoryProps = {
    customColor1: text("custom1 color", "cyan"),
    customHoverColor1: text("custom2 hoverColor", "yellow"),
    customMousePropagation1: boolean("custom1 mousePropagation", false),
    customIgnoreMouseEvents1: boolean("custom1 ignoreMouseEvents", false),
    customColor2: text("custom2 color", "orange"),
    customHoverColor2: text("custom2 hoverColor", "yellow"),
    customMousePropagation2: boolean("custom2 mousePropagation", false),
    customIgnoreMouseEvents2: boolean("custom2 ignoreMouseEvents", false)
  };

  return <GroupEventsComponent {...groupEventStoryProps} />;
}
