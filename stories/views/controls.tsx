// controls.tsx
import React from 'react';

// standard-view
import { View3D, Sphere } from '../../src';
import { STORY_STYLE } from '../utils/common';

function ControlsStory(args: any = {}): React.ReactElement {
  const {
    orbitControls = false,
    trackballControls = false,
    mapControls = false,
    cameraPosition = [0, 0, 5],
    cameraTarget = [0, 0, 0],
    cameraUp = [0, 0, 1],
    cameraRotation = [0, 0, 0],
    controlsEnabled = true,
    enableZoom = true,
    zoomSpeed = 1,
    minDistance = 0,
    maxDistance = 1000,
    enableRotate = true,
    rotateSpeed = 1,
    minPolarAngle = 0,
    maxPolarAngle = Math.PI,
    minAzimuthAngle = -100,
    maxAzimuthAngle = 100,
    enablePan = true,
    panSpeed = 1,
    enableDamping = false,
    dampingFactor = 0.25,
    autoRotate = false,
    autoRotateSpeed = 2,
    enableKeys = true,
    polarAngle = 0,
    azimuthAngle = 0,
  } = args || {};

  return (
    <View3D
      orbitControls={orbitControls}
      trackballControls={trackballControls}
      mapControls={mapControls}
      camera={{
        position: cameraPosition,
        target: cameraTarget,
        up: cameraUp,
        rotation: cameraRotation,
      }}
      controls={{
        enabled: controlsEnabled,
        enableZoom,
        zoomSpeed,
        minDistance,
        maxDistance,
        enableRotate,
        rotateSpeed,
        minPolarAngle,
        maxPolarAngle,
        minAzimuthAngle,
        maxAzimuthAngle,
        enablePan,
        panSpeed,
        enableDamping,
        dampingFactor,
        autoRotate,
        autoRotateSpeed,
        enableKeys,
        polarAngle,
        azimuthAngle,
      }}
      style={STORY_STYLE}
    >
      <Sphere position={[0, 0.75, 0]} color="blue" />
      <Sphere position={[0, -0.75, 0]} color="lightblue" />
      <Sphere position={[0.75, 0, 0]} color="red" />
      <Sphere position={[-0.75, 0, 0]} color="pink" />
    </View3D>
  );
}

ControlsStory.args = {
  orbitControls: false,
  trackballControls: false,
  mapControls: false,
  cameraPosition: [0, 0, 5],
  cameraTarget: [0, 0, 0],
  cameraUp: [0, 0, 1],
  cameraRotation: [0, 0, 0],
  controlsEnabled: true,
  enableZoom: true,
  zoomSpeed: 1,
  minDistance: 0,
  maxDistance: 1000,
  enableRotate: true,
  rotateSpeed: 1,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  minAzimuthAngle: -100,
  maxAzimuthAngle: 100,
  enablePan: true,
  panSpeed: 1,
  enableDamping: false,
  dampingFactor: 0.25,
  autoRotate: false,
  autoRotateSpeed: 2,
  enableKeys: true,
  polarAngle: 0,
  azimuthAngle: 0,
};

ControlsStory.argTypes = {
  orbitControls: {
    control: { type: 'boolean' },
    description: 'Enable orbit controls',
    defaultValue: false,
  },
  trackballControls: {
    control: { type: 'boolean' },
    description: 'Enable trackball controls',
    defaultValue: false,
  },
  mapControls: {
    control: { type: 'boolean' },
    description: 'Enable map controls',
    defaultValue: false,
  },
  cameraPosition: {
    control: { type: 'object' },
    description: 'Camera position',
    defaultValue: [0, 0, 5],
  },
  cameraTarget: {
    control: { type: 'object' },
    description: 'Camera target',
    defaultValue: [0, 0, 0],
  },
  cameraUp: {
    control: { type: 'object' },
    description: 'Camera up vector',
    defaultValue: [0, 0, 1],
  },
  cameraRotation: {
    control: { type: 'object' },
    description: 'Camera rotation',
    defaultValue: [0, 0, 0],
  },
  controlsEnabled: {
    control: { type: 'boolean' },
    description: 'Enable controls',
    defaultValue: true,
  },
  enableZoom: {
    control: { type: 'boolean' },
    description: 'Enable zoom',
    defaultValue: true,
  },
  zoomSpeed: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Zoom speed',
    defaultValue: 1,
  },
  minDistance: {
    control: { type: 'number', min: 0, max: 100 },
    description: 'Minimum distance',
    defaultValue: 0,
  },
  maxDistance: {
    control: { type: 'number', min: 100, max: 2000 },
    description: 'Maximum distance',
    defaultValue: 1000,
  },
  enableRotate: {
    control: { type: 'boolean' },
    description: 'Enable rotation',
    defaultValue: true,
  },
  rotateSpeed: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Rotation speed',
    defaultValue: 1,
  },
  minPolarAngle: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Minimum polar angle',
    defaultValue: 0,
  },
  maxPolarAngle: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Maximum polar angle',
    defaultValue: Math.PI,
  },
  minAzimuthAngle: {
    control: { type: 'number', min: -Math.PI, max: Math.PI, step: 0.1 },
    description: 'Minimum azimuth angle',
    defaultValue: -100,
  },
  maxAzimuthAngle: {
    control: { type: 'number', min: -Math.PI, max: Math.PI, step: 0.1 },
    description: 'Maximum azimuth angle',
    defaultValue: 100,
  },
  enablePan: {
    control: { type: 'boolean' },
    description: 'Enable panning',
    defaultValue: true,
  },
  panSpeed: {
    control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
    description: 'Pan speed',
    defaultValue: 1,
  },
  enableDamping: {
    control: { type: 'boolean' },
    description: 'Enable damping',
    defaultValue: false,
  },
  dampingFactor: {
    control: { type: 'number', min: 0, max: 1, step: 0.05 },
    description: 'Damping factor',
    defaultValue: 0.25,
  },
  autoRotate: {
    control: { type: 'boolean' },
    description: 'Auto rotate',
    defaultValue: false,
  },
  autoRotateSpeed: {
    control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
    description: 'Auto rotate speed',
    defaultValue: 2,
  },
  enableKeys: {
    control: { type: 'boolean' },
    description: 'Enable keys',
    defaultValue: true,
  },
  polarAngle: {
    control: { type: 'number', min: 0, max: Math.PI, step: 0.1 },
    description: 'Polar angle',
    defaultValue: 0,
  },
  azimuthAngle: {
    control: { type: 'number', min: -Math.PI, max: Math.PI, step: 0.1 },
    description: 'Azimuth angle',
    defaultValue: 0,
  },
};

export default ControlsStory;
