// light.stories.js
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

// Lights Stories
import AmbientLightStory from "./lights/ambient-light";
import DirectionalLightStory from "./lights/directional-light";
import HemisphereLightStory from "./lights/hemisphere-light";
import PointLightStory from "./lights/point-light";
import RectAreaLightStory from "./lights/rect-area-light";
import SpotLightStory from "./lights/spot-light";
import ShadowStory from "./lights/shadows";
import View3DEnvmapStory from "./lights/view3D-envmap";

const stories = storiesOf("Lights", module);
stories.addDecorator(withKnobs);

// Light Stories
stories.add("AmbientLight", AmbientLightStory);
stories.add("DirectionalLight", DirectionalLightStory);
stories.add("HemisphereLight", HemisphereLightStory);
stories.add("PointLight", PointLightStory);
stories.add("RectAreaLight", RectAreaLightStory);
stories.add("SpotLight", SpotLightStory);
stories.add("Shadows", ShadowStory);
stories.add("View3D EnvMap", View3DEnvmapStory);
