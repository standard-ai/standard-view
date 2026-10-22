// damaged-helmet.tsx
import React from 'react';
import * as THREE from 'three';

// standard-view
import { View3D, GLTF } from '../../src';
import { STORY_STYLE } from '../utils/common';

const DamagedHelmet = (args: any = {}): React.ReactElement => {
  const {
    autoRotate = true,
    background = 'backgrounds/overpass.hdr',
    scale = [1, 1, 1],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  } = args || {};

  const RGBE = background === 'backgrounds/overpass.hdr';

  return (
    <View3D
      camera={{
        fov: 45,
      }}
      orbitControls
      style={STORY_STYLE}
      controls={{ autoRotate }}
      backgroundEquirectangularRGBEURL={RGBE ? background : undefined}
      backgroundEquirectangularTextureURL={background}
      gl={{ outputColorSpace: THREE.SRGBColorSpace }}
    >
      <GLTF
        position={position}
        rotation={rotation}
        scale={scale}
        gltfPath="gltf/damaged-helmet/"
        gltfURL="DamagedHelmet.gltf"
        dracoDecoderPath="gltf/draco-decoders/"
        view3DEnvMap
      />
    </View3D>
  );
};

DamagedHelmet.args = {
  autoRotate: true,
  background: 'backgrounds/overpass.hdr',
  scale: [1, 1, 1],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
};

DamagedHelmet.argTypes = {
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Enable auto rotation',
    defaultValue: true,
  },
  background: {
    control: { type: 'select' },
    options: {
      'Overpass HDR': 'backgrounds/overpass.hdr',
      Store: 'backgrounds/store.jpg',
      Manga: 'backgrounds/manga.jpg',
      Croatia: 'backgrounds/croatia.jpg',
      'Modern Room': 'backgrounds/modern-room.jpg',
      Snow: 'backgrounds/snow.jpg',
      Fridge: 'backgrounds/fridge.png',
      'Drawing Room': 'backgrounds/drawingroom.jpg',
      'Snow Mountains': 'backgrounds/snow-mountains.jpg',
      Pattern: 'backgrounds/pattern.jpg',
    },
    description: 'Background texture',
    defaultValue: 'backgrounds/overpass.hdr',
  },
  scale: {
    control: { type: 'object' },
    description: 'Scale of the model',
    defaultValue: [1, 1, 1],
  },
  position: {
    control: { type: 'object' },
    description: 'Position of the model',
    defaultValue: [0, 0, 0],
  },
  rotation: {
    control: { type: 'object' },
    description: 'Rotation of the model',
    defaultValue: [0, 0, 0],
  },
};

export default DamagedHelmet;
