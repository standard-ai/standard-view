// line.stories.js

// Line Stories
import { default as BoundingBox } from './lines/bounding-box';
export { default as Line } from './lines/line';

// Default export for Storybook
export default {
  title: 'Lines',
};

export const BoundingBoxStory = {
  render: BoundingBox,
  name: 'Bounding Box',
  args: BoundingBox.args,
  argTypes: BoundingBox.argTypes,
};
