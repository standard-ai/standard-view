// view.stories.js
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

// View Stories
import ControlsStory from "./views/controls";
import NestedContextStory from "./views/nested-contexts";
import UpdatingContext from "./views/updating-context";

const stories = storiesOf("Views", module);
stories.addDecorator(withKnobs);

// View Stories
stories.add("Controls", ControlsStory);
stories.add("Updating Context", UpdatingContext);
stories.add("Nested Contexts", NestedContextStory);
