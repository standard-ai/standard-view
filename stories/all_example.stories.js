// all_example.stories.js

// Example Stories
import { default as SamplePlatter } from './examples/sample-platter';
import { default as DamagedHelmet } from './examples/damaged-helmet';
import { default as StandardCube } from './examples/standard-cube';
export { default as Rotation } from './examples/rotation';
export { default as Hello } from './examples/hello';

// Default export for Storybook
export default {
  title: 'Standard View Core Examples',
};

export const SamplePlatterStory = {
  render: SamplePlatter,
  name: 'Sample Platter',
  args: SamplePlatter.args,
  argTypes: SamplePlatter.argTypes,
};

export const DamagedHelmetStory = {
  render: DamagedHelmet,
  name: 'Damaged Helmet',
  args: DamagedHelmet.args,
  argTypes: DamagedHelmet.argTypes,
};

export const StandardCubeStory = {
  render: StandardCube,
  name: 'Standard Cube',
  args: StandardCube.args,
  argTypes: StandardCube.argTypes,
};
