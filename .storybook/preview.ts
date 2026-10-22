/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      panelPosition: "right",
      theme: undefined
    }
  },
};

export default preview; 