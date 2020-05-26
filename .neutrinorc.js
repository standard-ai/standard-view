const airbnb = require("@neutrinojs/airbnb");
const reactComponents = require("@neutrinojs/react-components");
const jest = require("@neutrinojs/jest");
const path = require("path");
const typescript = () => neutrino => {
  const { extensions } = neutrino.options;
  const index = extensions.indexOf("js");
  extensions.splice(index, 0, "ts", "tsx");
  neutrino.options.extensions = extensions;
};

module.exports = {
  options: {
    root: __dirname,
    output: path.resolve("dist")
  },
  use: [
    typescript(),
    airbnb({
      eslint: {
        envs: ["browser", "commonjs", "es6", "node", "jest", "jasmine"],
        parser: "@typescript-eslint/parser",
        failOnError: false,
        failOnWarning: false,
        parserOptions: {
          ecmaVersion: 7,
          ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
          }
        },
        baseConfig: {
          extends: [
            "plugin:import/typescript",
            "plugin:prettier/recommended",
            "plugin:@typescript-eslint/recommended",
            "prettier/babel",
            "prettier/react",
            "prettier/@typescript-eslint"
          ]
        },
        plugins: ["prettier", "react", "jest", "react-hooks"],
        rules: {
          "babel/semi": "off",
          "consistent-return": "warn", // remove me
          eqeqeq: "warn", // remove me
          "default-case": "warn",
          "prefer-const": "warn",
          "prefer-destructuring": "off",
          "no-shadow": "warn",
          "no-console": [2, { allow: ["warn", "error"] }],
          "no-else-return": "off",
          "no-param-reassign": "warn",
          "no-plusplus": "off",
          "no-restricted-syntax": "warn",
          "no-unused-vars": [
            1,
            {
              args: "none",
              ignoreRestSiblings: true,
              varsIgnorePattern: "^_"
            }
          ],
          "no-unneeded-ternary": "warn",
          "object-shorthand": "warn",
          "spaced-comment": "warn",
          "react/jsx-filename-extension": "off",
          "react/require-default-props": "off", // using default params instead
          "react/destructuring-assignment": "warn",
          "react/default-props-match-prop-types": "off", // after fixing general style
          "import/prefer-default-export": "warn",
          "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true }
          ],
          "no-underscore-dangle": "off",
          "no-use-before-define": "warn",
          "@typescript-eslint/ban-ts-ignore": "off",
          "@typescript-eslint/no-inferrable-types": "warn",
          "@typescript-eslint/ban-types": "warn",
          "@typescript-eslint/no-empty-interface": "warn"
        }
      }
    }),
    reactComponents({
      babel: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript"
        ],
        plugins: ["@babel/plugin-transform-runtime"]
      },
      components: "/"
    }),
    jest()
  ]
};
