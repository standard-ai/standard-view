import { addParameters, configure } from "@storybook/react";

// Option defaults:
addParameters({
  options: {
    /**
     * where to show the addon panel
     * @type {('bottom'|'right')}
     */
    panelPosition: "right",
    /**
     * theme storybook
     */
    theme: undefined
  }
});

// Automatically Import All Story Files
const req = require.context("../stories", true, /\.stories\.(js|ts|tsx)$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
