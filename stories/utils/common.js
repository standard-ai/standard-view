// common.js
import React from "react";
import _ from "lodash";
import {
  Plane,
  DirectionalLight,
  AmbientLight,
  Sphere,
  Box,
  Group,
  Text
} from "../../src";
import { generateGroupProps } from "../../src/groups/Group";

export const KNOB_GROUP = {
  VIEW3D: "View3D",
  GEOMETRY: "Geometry",
  MATERIAL: "Material",
  ENVIRONMENT: "Environment",
  SIMULATION: "Simulation",
  PERFORMANCE: "Performance"
};

// ----------------------//
// -----   View3D   -----//
// ----------------------//
export const view3DProps = {
  orbitControls: true,
  camera: { position: [0, 4, 6] },
  shadowMapEnabled: true,
  style: {
    height: "stretch",
    width: "stretch",
    minHeight: "80vh"
  }
};

export const STORY_STYLE = {
  height: "stretch",
  width: "stretch",
  minHeight: "80vh"
};

// --------------------------//
// -----   Animations   -----//
// --------------------------//
export function spin({ mesh, state }): void {
  // Default State
  state.r = state.r == null ? 0 : state.r;
  state.speed = state.speed == null ? 1 : state.speed;

  // Spin
  state.r = (state.r + state.speed * 0.01) % (Math.PI * 2);
  mesh.current.rotation.x = state.r;
  mesh.current.rotation.y = state.r;
}

export function spinZ({ mesh, state }): void {
  // Default State
  state.r = state.r == null ? 0 : state.r;
  state.speed = state.speed == null ? 1 : state.speed;

  // Spin
  state.r = (state.r + state.speed * 0.01) % (Math.PI * 2);
  mesh.current.rotation.z = state.r;
}

export function spinY({ mesh, state }): void {
  // Default State
  state.r = state.r == null ? 0 : state.r;
  state.speed = state.speed == null ? 1 : state.speed;

  // Spin
  state.r = (state.r + state.speed * 0.01) % (Math.PI * 2);
  mesh.current.rotation.y = state.r;
}

// -----------------------//
// -----   Objects   -----//
// -----------------------//
export function Ground({
  position = [0, -1, 0],
  materialType = "lambert",
  color = "gray",
  ...otherProps
}: any): React.Node {
  return (
    <Plane
      position={position}
      rotation={[-Math.PI * 0.5, 0, 0]}
      scale={[1000, 1000, 1]}
      materialType={materialType}
      color={color}
      receiveShadow
      {...otherProps}
    />
  );
}

export function Balls(props: any): React.Node {
  const r = 3;
  const deg30 = Math.PI / 3;
  const x30 = Math.sin(deg30) * r;
  const z30 = Math.cos(deg30) * r;
  const { cleanedProps: otherProps, groupProps } = generateGroupProps(props);

  return (
    <Group {...groupProps}>
      <Box
        position={[0, 3, 0]}
        materialType="physical"
        color="white"
        castShadow
        animation={spin}
        {...otherProps}
      />
      <Sphere
        position={[0, 0, r]}
        materialType="basic"
        color="gold"
        castShadow
        receiveShadow
        {...otherProps}
      >
        <Text position={[-0.3, 1.2, 0]} text="basic" size={0.2} color="snow" />
      </Sphere>
      <Sphere
        position={[-x30, 0, z30]}
        materialType="lambert"
        color="gold"
        castShadow
        receiveShadow
        {...otherProps}
      >
        <Text
          position={[-0.3, 1.2, 0]}
          text="lambert"
          size={0.2}
          color="snow"
        />
      </Sphere>
      <Sphere
        position={[-x30, 0, -z30]}
        materialType="phong"
        color="gold"
        castShadow
        receiveShadow
        {...otherProps}
      >
        <Text position={[-0.3, 1.2, 0]} text="phong" size={0.2} color="snow" />
      </Sphere>
      <Sphere
        position={[0, 0, -r]}
        materialType="standard"
        color="gold"
        castShadow
        receiveShadow
        {...otherProps}
      >
        <Text
          position={[-0.3, 1.2, 0]}
          text="standard"
          size={0.2}
          color="snow"
        />
      </Sphere>
      <Sphere
        position={[x30, 0, -z30]}
        materialType="physical"
        color="gold"
        castShadow
        receiveShadow
        {...otherProps}
      >
        <Text
          position={[-0.3, 1.2, 0]}
          text="physical"
          size={0.2}
          color="snow"
        />
      </Sphere>
      <Group position={[x30, 0, z30]}>
        <Sphere
          materialType="physical"
          rotation={[0, -Math.PI * 0.5, Math.PI * 0.25]}
          textureURL="/lights/soccer.jpg"
          castShadow
          receiveShadow
          {...otherProps}
        />
        <Text
          position={[-0.3, 1.2, 0]}
          text="physical + texture"
          size={0.2}
          color="snow"
        />
      </Group>
    </Group>
  );
}

// ----------------------//
// -----   Lights   -----//
// ----------------------//
export function Light({
  position = [3, 10, 3],
  ...otherProps
}: any): React.Node {
  return (
    <>
      <AmbientLight intensity={0.3} />
      <DirectionalLight castShadow position={position} {...otherProps} />
    </>
  );
}
