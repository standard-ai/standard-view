// view.stories.js

// View Stories
import { default as NestedContext } from './views/nested-contexts';
import { default as UpdatingContext } from './views/updating-context';
export { default as Controls } from './views/controls';

// Default export for Storybook
export default {
  title: 'Views',
};

export const NestedContextStory = {
  render: NestedContext,
  name: 'Nested Context',
  args: NestedContext.args,
  argTypes: NestedContext.argTypes,
};

export const UpdatingContextStory = {
  render: UpdatingContext,
  name: 'Updating Context',
  args: UpdatingContext.args,
  argTypes: UpdatingContext.argTypes,
};
