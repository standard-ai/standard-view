// See docs: https://storybook.js.org/configurations/custom-webpack-config/
// Curious about debugging this? Try console.dir(config, {depth: null});
// See https://storybook.js.org/docs/configurations/custom-webpack-config/#debug-the-default-webpack-config

const isDocGenPlugin = plugin =>
  Array.isArray(plugin) &&
  typeof plugin[0] === "string" &&
  plugin[0].includes("react-docgen");

module.exports = ({ config }) => {
  // https://github.com/storybooks/storybook/issues/4873
  // Strip out the babel-plugin-react-docgen
  // This crashes Storybook when using certain Flow features 🙃
  // See https://github.com/storybooks/storybook/issues/4873#issuecomment-458497220

  const babelLoader = config.module.rules[0].use[0];
  babelLoader.options.plugins = babelLoader.options.plugins.filter(
    plugin => !isDocGenPlugin(plugin)
  );

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [["react-app", { flow: false, typescript: true }]]
    }
  });
  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
