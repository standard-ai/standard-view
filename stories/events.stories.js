// events.stories.js
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

// Events Stories
import MouseEvents from "./events/mouse-events";
import GroupEvents from "./events/group-events";

const stories = storiesOf("Events", module);

stories.addDecorator(withKnobs);

// Events Stories
stories.add("Mouse Events", MouseEvents);
stories.add("Group Events", GroupEvents);
