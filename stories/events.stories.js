// events.stories.js

// Events Stories
import { default as MouseEvents } from './events/mouse-events';
import { default as GroupEvents } from './events/group-events';

// Default export for Storybook
export default {
  title: 'Events',
};

export const MouseEventsStory = {
  render: MouseEvents,
  name: 'Mouse Events',
  args: MouseEvents.args,
  argTypes: MouseEvents.argTypes,
};

export const GroupEventsStory = {
  render: GroupEvents,
  name: 'Group Events',
  args: GroupEvents.args,
  argTypes: GroupEvents.argTypes,
};
