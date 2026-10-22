// camera.js
import React from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

// standard-view
import { View3D, Camera, GLTF } from '../../src';
import { Ground, Light, STORY_STYLE } from '../utils/common';
import { useFrame } from '../../src/utils/hooks';

function AddControls({ group, scene, camera, gl }): void {
  const controls = new TransformControls(camera, gl.domElement);
  controls.addEventListener('change', () => {
    gl.render(scene, camera);
  });
  controls.addEventListener('dragging-changed', e => {
    camera.controls.enabled = !e.value;
  });
  controls.setMode('rotate');
  controls.attach(group.current);
  scene.add(controls.getHelper());
}

function OffCamera({ offCamera, color, opacity }): null {
  useFrame(function updateRenderLoop({ gl, scene, camera }) {
    if (offCamera) {
      // @ts-ignore:TS2339 cancelTailRender does not exist
      scene.cancelTailRender = true;
      if (color) {
        const transparent = opacity < 1;
        scene.overrideMaterial = new THREE.MeshBasicMaterial({
          color,
          opacity,
          transparent,
          depthWrite: false,
        });
      }
      gl.render(scene, camera);
      scene.overrideMaterial = null;
    }
  }, 2);

  return null;
}

function CameraStory(args: any = {}): React.ReactElement {
  // Visible
  const {
    autoRotate = false,
    cam1 = true,
    cull1 = false,
    cam2 = false,
    cull2 = false,
    city = true,
    offCamera = false,
    // Intrinsics
    // First Camera
    position1 = [-20, -80, 30],
    target1 = [-8, 0, 0],
    normal1 = [],
    up1 = [0, 0, 1],
    roll1 = 0,
    rotation1 = [],
    quaternion1 = [],
    coverageColor1 = 'red',
    coverageOpacity1 = 0.5,
    helper1 = true,
    showUp1 = true,
    showNormal1 = true,
    showRoll1 = true,
    showLabel1 = true,
    showLookAt1 = true,
    wireframeColor1 = 'black',
    // Second Camera
    position2 = [80, 2, 30],
    target2 = [],
    normal2 = [1, 0, 0.3],
    up2 = [0, 1, 0],
    roll2 = 0,
    rotation2 = [],
    quaternion2 = [0, 0, 0, 1],
    coverageColor2 = 'blue',
    coverageOpacity2 = 0.5,
    helper2 = true,
    showUp2 = true,
    showNormal2 = true,
    showRoll2 = true,
    showLabel2 = true,
    showLookAt2 = true,
    wireframeColor2 = 'black',
    // Off Camera
    offCameraColor = 'gray',
    offCameraOpacity = 0.5,
    hoverColor = 'yellow',
  } = args || {};

  const intrinsics = {
    type: 'perspective',
    width: 1,
    height: 1,
    left: -0.5,
    right: 0.5,
    top: 0.5,
    bottom: -0.5,
    near: 0.000001,
    far: 1000,
    fov: 50,
  };

  return (
    <View3D
      orbitControls
      orthographic
      camera={{
        position: [-200, -800, 300],
        up: [0, 0, 1],
        zoom: 50,
        far: 1000000,
      }}
      shadowMapEnabled
      style={STORY_STYLE}
      controls={{ autoRotate }}
      gl={{ outputColor: THREE.SRGBColorSpace }}
    >
      <Light position={[3, 3, 10]} />
      {cam1 && (
        <Camera
          {...intrinsics}
          onDoubleClick={AddControls}
          position={position1}
          normal={normal1}
          target={target1}
          rotation={rotation1}
          up={up1}
          roll={roll1}
          quaternion={quaternion1}
          labelText="Cam 1"
          helper={helper1}
          showLabel={showLabel1}
          showUp={showUp1}
          showNormal={showNormal1}
          showRoll={showRoll1}
          showLookAt={showLookAt1}
          cull={cull1}
          coverageColor={coverageColor1}
          coverageOpacity={coverageOpacity1}
          hoverColor={hoverColor}
          wireframeColor={wireframeColor1}
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
        visible={!city}
        opacity={0.8}
      />
      <GLTF
        gltfPath="gltf/"
        gltfURL="tokyo.glb"
        rotation={[Math.PI * 0.5, 0, 0]}
        position={[0, 0, 58.5]}
        scale={[0.3, 0.3, 0.3]}
        visible={city}
      />
      <OffCamera
        offCamera={offCamera}
        color={offCameraColor}
        opacity={offCameraOpacity}
      />
    </View3D>
  );
}

CameraStory.args = {
  autoRotate: false,
  cam1: true,
  cull1: false,
  cam2: false,
  cull2: false,
  city: true,
  offCamera: false,
  // Intrinsics
  // First Camera
  position1: [-20, -80, 30],
  target1: [-8, 0, 0],
  normal1: [],
  up1: [0, 0, 1],
  roll1: 0,
  rotation1: [],
  quaternion1: [],
  coverageColor1: 'red',
  coverageOpacity1: 0.5,
  helper1: true,
  showUp1: true,
  showNormal1: true,
  showRoll1: true,
  showLabel1: true,
  showLookAt1: true,
  wireframeColor1: 'black',
  // Second Camera
  position2: [80, 2, 30],
  target2: [],
  normal2: [1, 0, 0.3],
  up2: [0, 1, 0],
  roll2: 0,
  rotation2: [],
  quaternion2: [0, 0, 0, 1],
  coverageColor2: 'blue',
  coverageOpacity2: 0.5,
  helper2: true,
  showUp2: true,
  showNormal2: true,
  showRoll2: true,
  showLabel2: true,
  showLookAt2: true,
  wireframeColor2: 'black',
  // Off Camera
  offCameraColor: 'gray',
  offCameraOpacity: 0.5,
  hoverColor: 'yellow',
};

CameraStory.argTypes = {
  // Main Args
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Auto Rotation',
    defaultValue: false,
  },
  cam1: {
    control: { type: 'boolean' },
    description: 'Camera 1',
    defaultValue: true,
  },
  cull1: {
    control: { type: 'boolean' },
    description: 'Cull Camera 1',
    defaultValue: false,
  },
  cam2: {
    control: { type: 'boolean' },
    description: 'Camera 2',
    defaultValue: false,
  },
  cull2: {
    control: { type: 'boolean' },
    description: 'Cull Camera 2',
    defaultValue: false,
  },
  city: {
    control: { type: 'boolean' },
    description: 'City',
    defaultValue: true,
  },
  offCamera: {
    control: { type: 'boolean' },
    description: 'Background',
    defaultValue: false,
  },
  // Intrinsics
  // First Camera
  position1: {
    control: { type: 'object' },
    description: 'Camera 1 Position',
    defaultValue: [-20, -80, 30],
  },
  target1: {
    control: { type: 'object' },
    description: 'Camera 1 Target',
    defaultValue: [-8, 0, 0],
  },
  normal1: {
    control: { type: 'object' },
    description: 'Camera 1 Normal',
    defaultValue: [],
  },
  up1: {
    control: { type: 'object' },
    description: 'Camera 1 Up',
    defaultValue: [0, 0, 1],
  },
  roll1: {
    control: { type: 'object' },
    description: 'Camera 1 Roll',
    defaultValue: 0,
  },
  rotation1: {
    control: { type: 'object' },
    description: 'Camera 1 Rotation',
    defaultValue: [],
  },
  quaternion1: {
    control: { type: 'object' },
    description: 'Camera 1 Quaternion',
    defaultValue: [],
  },
  coverageColor1: {
    control: { type: 'color' },
    description: 'Camera 1 Coverage Color',
    defaultValue: 'red',
  },
  coverageOpacity1: {
    control: { type: 'number' },
    description: 'Camera 1 Opacity',
    defaultValue: 0.5,
  },
  helper1: {
    control: { type: 'boolean' },
    description: 'Camera 1 Helper',
    defaultValue: true,
  },
  showUp1: {
    control: { type: 'boolean' },
    description: 'Camera 1 Up Helper',
    defaultValue: true,
  },
  showNormal1: {
    control: { type: 'boolean' },
    description: 'Camera 1 Normal Helper',
    defaultValue: true,
  },
  showRoll1: {
    control: { type: 'boolean' },
    description: 'Camera 1 Roll Helper',
    defaultValue: true,
  },
  showLabel1: {
    control: { type: 'boolean' },
    description: 'Camera 1 Label',
    defaultValue: true,
  },
  showLookAt1: {
    control: { type: 'boolean' },
    description: 'Camera 1 LookAt Helper',
    defaultValue: true,
  },
  wireframeColor1: {
    control: { type: 'color' },
    description: 'Camera 1 Wireframe Color',
    defaultValue: 'black',
  },
  // Second Camera
  position2: {
    control: { type: 'object' },
    description: 'Camera 2 Position',
    defaulValue: [80, 2, 30],
  },
  target2: {
    control: { type: 'object' },
    description: 'Camera 2 Target',
    defaulValue: [],
  },
  normal2: {
    control: { type: 'object' },
    description: 'Camera 2 Normal',
    defaulValue: [1, 0, 0.3],
  },
  up2: {
    control: { type: 'object' },
    description: 'Camera 2 Up',
    defaulValue: [0, 1, 0],
  },
  roll2: {
    control: { type: 'object' },
    description: 'Camera 2 Roll',
    defaulValue: 0,
  },
  rotation2: {
    control: { type: 'object' },
    description: 'Camera 2 Rotation',
    defaulValue: [],
  },
  quaternion2: {
    control: { type: 'object' },
    description: 'Camera 2 Quaternion',
    defaulValue: [0, 0, 0, 1],
  },
  coverageColor2: {
    control: { type: 'color' },
    description: 'Camera 2 Color',
    defaulValue: 'blue',
  },
  coverageOpacity2: {
    control: { type: 'number' },
    description: 'Camera 2 Opacity',
    defaulValue: 0.5,
  },
  helper2: {
    control: { type: 'boolean' },
    description: 'Camera 2 Helper',
    defaulValue: true,
  },
  showUp2: {
    control: { type: 'boolean' },
    description: 'Camera 2 Up Helper',
    defaulValue: true,
  },
  showNormal2: {
    control: { type: 'boolean' },
    description: 'Camera 2 Normal Helper',
    defaulValue: true,
  },
  showRoll2: {
    control: { type: 'boolean' },
    description: 'Camera 2 Roll Helper',
    defaulValue: true,
  },
  showLabel2: {
    control: { type: 'boolean' },
    description: 'Camera 2 Label',
    defaulValue: true,
  },
  showLookAt2: {
    control: { type: 'boolean' },
    description: 'Camera 2 LookAt Helper',
    defaulValue: true,
  },
  wireframeColor2: {
    control: { type: 'color' },
    description: 'Camera 2 Wireframe Color',
    defaulValue: 'black',
  },
  // Off Camera
  offCameraColor: {
    control: { type: 'color' },
    description: 'Background Color',
    defaultValue: 'gray',
  },
  offCameraOpacity: {
    control: { type: 'number' },
    description: 'Background Opacity',
    defaultValue: 0.5,
  },
  hoverColor: {
    control: { type: 'color' },
    description: 'Background Hover Color',
    defaultValue: 'yellow',
  },
};

export default CameraStory;
