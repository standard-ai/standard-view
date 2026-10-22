// light.stories.js

// Lights Stories
import { default as AmbientLight } from './lights/ambient-light';
import { default as DirectionalLight } from './lights/directional-light';
import { default as HemisphereLight } from './lights/hemisphere-light';
import { default as PointLight } from './lights/point-light';
import { default as RectAreaLight } from './lights/rect-area-light';
import { default as SpotLight } from './lights/spot-light';
import { default as Shadows } from './lights/shadows';
import { default as View3DEnvmap } from './lights/view3D-envmap';

// Default export for Storybook
export default {
  title: 'Lights',
};

export const AmbientLightStory = {
  render: AmbientLight,
  name: 'Ambient Light',
  args: AmbientLight.args,
  argTypes: AmbientLight.argTypes,
};

export const DirectionalLightStory = {
  render: DirectionalLight,
  name: 'Directional Light',
  args: DirectionalLight.args,
  argTypes: DirectionalLight.argTypes,
};

export const HemisphereLightStory = {
  render: HemisphereLight,
  name: 'Hemisphere Light',
  args: HemisphereLight.args,
  argTypes: HemisphereLight.argTypes,
};

export const PointLightStory = {
  render: PointLight,
  name: 'Point Light',
  args: PointLight.args,
  argTypes: PointLight.argTypes,
};

export const RectAreaLightStory = {
  render: RectAreaLight,
  name: 'Rect Area Light',
  args: RectAreaLight.args,
  argTypes: RectAreaLight.argTypes,
};

export const SpotLightStory = {
  render: SpotLight,
  name: 'Spot Light',
  args: SpotLight.args,
  argTypes: SpotLight.argTypes,
};

export const ShadowsStory = {
  render: Shadows,
  name: 'Shadows',
  args: Shadows.args,
  argTypes: Shadows.argTypes,
};

export const View3DEnvmapStory = {
  render: View3DEnvmap,
  name: 'View3D Envmap',
  args: View3DEnvmap.args,
  argTypes: View3DEnvmap.argTypes,
};
