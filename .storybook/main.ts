/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.@(js|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../stories/assets'],
  viteFinal: async (config) => {
    return config;
  }
};
export default config; 