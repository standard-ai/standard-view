// shadows.js
import React from "react";
import { text, number, boolean } from "@storybook/addon-knobs";

// standard-view
import * as THREE from "three";
import {
  View3D,
  PointLight,
  AmbientLight,
  Sphere,
  Box,
  Cylinder,
  GLTF
} from "../../src";
import { spin, spinY, Ground, KNOB_GROUP } from "../utils/common";

export default function ShadowStory(): React.Node {
  const autoRotate = boolean("autoRotate", false, KNOB_GROUP.VIEW3D);
  return (
    <View3D
      backgroundColor="black"
      orbitControls
      camera={{ position: [0, 4, 6] }}
      shadowMapEnabled={boolean(
        "View3D shadowMapEnabled",
        true,
        KNOB_GROUP.VIEW3D
      )}
      shadowType={text(
        "View3D shadowType [basic, pcf, pcfsoft]",
        "pcfsoft",
        KNOB_GROUP.VIEW3D
      )}
      style={{
        height: "stretch",
        width: "stretch",
        minHeight: "80vh"
      }}
      controls={{ autoRotate }}
      gl={{ outputEncoding: THREE.sRGBEncoding }}
    >
      <Sphere
        position={[-4, 1.25, 1]}
        radius={1.5}
        color="white"
        materialType="phong"
        castShadow
        receiveShadow
      />
      <GLTF
        position={[2.5, 2.5, 1]}
        scale={[0.01, 0.01, 0.01]}
        gltfPath="gltf/"
        gltfURL="flamingo.glb"
        dracoDecoderPath="gltf/draco-decoders/"
        castShadow={boolean("Flamingo castShadow", true, KNOB_GROUP.MATERIAL)}
        receiveShadow={boolean(
          "Flamingo receiveShadow",
          true,
          KNOB_GROUP.MATERIAL
        )}
        animation={spin}
      />
      <GLTF
        position={[-1, 2.75, 0.25]}
        scale={[0.7, 0.7, 0.7]}
        gltfPath="gltf/damaged-helmet/"
        gltfURL="DamagedHelmet.gltf"
        castShadow={boolean("Helmet castShadow", true, KNOB_GROUP.MATERIAL)}
        receiveShadow={boolean(
          "Helmet receiveShadow",
          true,
          KNOB_GROUP.MATERIAL
        )}
        animation={spinY}
      />
      <Ground
        rotation={[-Math.PI * 0.5, 0, 0]}
        materialType="phong"
        color="white"
      />
      <Cylinder
        start={[9, 0, -1]}
        end={[9, 3, -1]}
        radius={1.5}
        materialType="physical"
        opacity={0.5}
        color="cyan"
        castShadow
        receiveShadow
      />
      <Cylinder
        start={[2, 0, 3]}
        end={[2, 0.5, 3]}
        radius={2.5}
        materialType="phong"
        color="red"
        castShadow={boolean("Red Disk castShadow", true, KNOB_GROUP.MATERIAL)}
        receiveShadow={boolean(
          "Red disk receiveShadow",
          true,
          KNOB_GROUP.MATERIAL
        )}
      />
      <Box
        position={[2, 1.3, 2]}
        scale={[4, 0.6, 0.6]}
        materialType="standard"
        color="yellow"
        castShadow={boolean("Gold Bar castShadow", true, KNOB_GROUP.MATERIAL)}
        receiveShadow={boolean(
          "Gold Bar receiveShadow",
          true,
          KNOB_GROUP.MATERIAL
        )}
      />

      {/* Lights */}
      <PointLight
        position={[3, 4, -1]}
        color="white"
        intensity={0.8}
        decay={0.8}
        castShadow={boolean("Light1 castShadow", true, KNOB_GROUP.ENVIRONMENT)}
        shadowMapWidth={number(
          "Light1 shadowMapWidth",
          2048,
          {},
          KNOB_GROUP.ENVIRONMENT
        )}
        shadowMapHeight={number(
          "Light1 shadowMapHeight",
          2048,
          {},
          KNOB_GROUP.ENVIRONMENT
        )}
        helper
      />
      <PointLight
        position={[-6, 4, 1.5]}
        color="white"
        intensity={0.8}
        decay={0.8}
        castShadow={boolean("Light2 castShadow", true, KNOB_GROUP.ENVIRONMENT)}
        shadowMapWidth={number(
          "Light2 shadowMapWidth",
          2048,
          {},
          KNOB_GROUP.ENVIRONMENT
        )}
        shadowMapHeight={number(
          "Light2 shadowMapHeight",
          2048,
          {},
          KNOB_GROUP.ENVIRONMENT
        )}
        helper
      />
      <AmbientLight
        intensity={number(
          "Ambient Light intensity",
          0.2,
          {},
          KNOB_GROUP.ENVIRONMENT
        )}
      />
    </View3D>
  );
}
