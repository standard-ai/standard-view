// example.stories.js
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

// Example Stories
import SamplePlatter from "./examples/sample-platter";
import SC from "./examples/standard-cube";
import DamageHelmet from "./examples/damaged-helmet";
import RotationStory from "./examples/rotation";

const stories = storiesOf("Standard View Core Examples", module);

stories.addDecorator(withKnobs);

// Example Stories
stories.add("Sample Platter", SamplePlatter);
stories.add("Standard Cube", SC);
stories.add("Damaged Helmet", DamageHelmet);
stories.add("Rotation", RotationStory);
