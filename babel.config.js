const path = require("path");
const isEnvDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // Allow importing core-js in entrypoint and use browserlist to select polyfills
        useBuiltIns: 'entry',
        // Set the corejs version we are using to avoid warnings in console
        corejs: 3,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
      },
    ],
    [
      "@babel/preset-react",
      {
        development: isEnvDevelopment,
        // For hasJsxRuntime
        runtime: "automatic",
      }
    ],
  ],
  plugins: [
    /**
     * If you are including your plugins manually and using @babel/plugin-transform-class-properties, make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-transform-class-properties.
     */
    [
      "@babel/plugin-proposal-decorators",
      {
        // If you use @babel/preset-typescript for typescript legacy should be true. But we use ts-loader instead.
        version: "2023-05",
        // decoratorsBeforeExport: false, // is disallowed when using version: "legacy", version: "2022-03", version: "2023-01", or version: "2023-05"; Babel 8 will only support "2023-05" and "legacy". If you are using a different decorators version, it's recommended to migrate to "2023-05".
      },
    ],
    // class { handleClick = () => { } }
    // Enable loose mode to use assignment instead of defineProperty
    // See discussion in https://github.com/facebook/create-react-app/issues/4263
    // Note:
    // 'loose' mode configuration must be the same for
    // * @babel/plugin-transform-class-properties
    // * @babel/plugin-transform-private-methods
    // * @babel/plugin-transform-private-property-in-object
    // (when they are enabled)
    [
      "@babel/plugin-transform-class-properties",
      {
        loose: true,
      },
    ],
    [
      "@babel/plugin-transform-private-methods",
      {
        loose: true,
      },
    ],
    [
      "@babel/plugin-transform-private-property-in-object",
      {
        loose: true, // The loose mode configuration setting must be the same as @babel/plugin-transform-class-properties.
      },
    ],
    [
      "@babel/plugin-transform-runtime", // enables the re-use of Babel's injected helper code to save on codesize.
      {
        corejs: false,
        helpers: true,
        // By default, babel assumes babel/runtime version 7.0.0-beta.0,
        // explicitly resolving to match the provided helper functions.
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
        regenerator: true,
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
        // We should turn this on once the lowest version of Node LTS
        // supports ES Modules.
        useESModules: true,
        absoluteRuntime: path.dirname(
          require.resolve('@babel/runtime/package.json')
        ),
      }
    ],
    !isEnvDevelopment && [
      // Remove PropTypes from production build
      "babel-plugin-transform-react-remove-prop-types",
      {
        removeImport: true,
      },
    ],
    // Optional chaining and nullish coalescing are supported in @babel/preset-env,
    // but not yet supported in webpack due to support missing from acorn.
    // These can be removed once webpack has support.
    // See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
    "@babel/plugin-transform-optional-chaining",
    "@babel/plugin-transform-nullish-coalescing-operator",
    isEnvDevelopment && "react-refresh/babel",
  ].filter(Boolean),
  exclude: [/core-js/],
};
