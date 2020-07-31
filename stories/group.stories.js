// group.stories.js
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

// Group Stories
import AxisStory from "./groups/axis";
import ArrowStory from "./groups/arrow";
import Camera from "./groups/camera";
import CapsuleStory from "./groups/capsule";
import FBXStory from "./groups/fbx";
import OBJStory from "./groups/obj";
import GLTFStory from "./groups/gltf";
import PCDStory from "./groups/pcd";
import PathStory from "./groups/path";

const stories = storiesOf("Groups", module);
stories.addDecorator(withKnobs);
const storySettings = { knobs: { timestamps: true, escapeHTML: true } };

// Group Stories
stories.add("Axis", AxisStory, storySettings);
stories.add("Arrow", ArrowStory, storySettings);
stories.add("Camera", Camera);
stories.add("Capsule", CapsuleStory, storySettings);
stories.add("FBX", FBXStory, storySettings);
stories.add("OBJ", OBJStory, storySettings);
stories.add("GLTF", GLTFStory, storySettings);
stories.add("PCD", PCDStory, storySettings);
stories.add("Path", PathStory, storySettings);
