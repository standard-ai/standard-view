// mesh.stories.js
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

// Mesh Stories
import TriangleStory from "./meshes/triangle";
import QuadStory from "./meshes/quad";
import BoxStory from "./meshes/box";
import CircleStory from "./meshes/circle";
import CylinderStory from "./meshes/cylinder";
import LabelStory from "./meshes/label";
import PlaneStory from "./meshes/plane";
import SphereStory from "./meshes/sphere";
import TextStory from "./meshes/text";
import Polygon from "./meshes/polygon";

const stories = storiesOf("Meshes", module);
stories.addDecorator(withKnobs);

// Mesh Stories
stories.add("Triangle", TriangleStory);
stories.add("Quad", QuadStory);
stories.add("Box", BoxStory);
stories.add("Circle", CircleStory);
stories.add("Cylinder", CylinderStory);
stories.add("Label", LabelStory);
stories.add("Plane", PlaneStory);
stories.add("Sphere", SphereStory);
stories.add("Text", TextStory);
stories.add("Polygon", Polygon);
