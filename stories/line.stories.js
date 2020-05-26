// line.stories.js
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

// Line Stories
import LineStory from "./lines/line.js";
import BoundingBoxStory from "./lines/bounding-box.js";

const stories = storiesOf("Lines", module);
stories.addDecorator(withKnobs);

// Line Stories
stories.add("Line", LineStory);
stories.add("BoundingBox", BoundingBoxStory);
