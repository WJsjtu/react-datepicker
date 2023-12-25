import webpack, { DefinePlugin } from "webpack";
import "webpack-dev-server";
import * as path from "path";
import * as fs from "fs";

interface WebpackPlugin {
  new(...options: unknown[]): webpack.WebpackPluginInstance;
}
interface WebpackResolvePlugin {
  new(...options: unknown[]): webpack.ResolvePluginInstance;
}

const ESLintPlugin = require("eslint-webpack-plugin") as typeof import("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin") as typeof import("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin") as typeof import("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin") as typeof import("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin") as typeof import("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin") as WebpackPlugin;
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin") as WebpackPlugin;
const { WebpackManifestPlugin } = require("webpack-manifest-plugin") as typeof import("webpack-manifest-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin") as typeof import("@pmmmwh/react-refresh-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin") as WebpackResolvePlugin;
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin") as WebpackPlugin;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin") as WebpackPlugin;
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin") as WebpackPlugin;
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin") as WebpackPlugin;
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent") as WebpackPlugin;

const reactRefreshRuntimeEntry = require.resolve("react-refresh/runtime");
const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
  "@pmmmwh/react-refresh-webpack-plugin",
);
const babelRuntimeEntry = require.resolve("@babel/preset-react");
const babelRuntimeEntryHelpers = require.resolve(
  "@babel/runtime/helpers/esm/assertThisInitialized",
  { paths: [babelRuntimeEntry] },
);
const babelRuntimeRegenerator = require.resolve("@babel/runtime/regenerator", {
  paths: [babelRuntimeEntry],
});

const configBasePath = __dirname;

const config = {
  outputDir: "../../dist/client",

  dev: {
    publicPath: "/",
    port: 8080,
  },

  build: {
    publicPath: "/",
  },
};

const CreateWebpackConfig = (env: { [key: string]: unknown }) => {

  const WebapckMode = env.NODE_ENV === "production" ? "production" : "development";

  if (process.env.NODE_ENV == null) {
    process.env.NODE_ENV = WebapckMode;
  }
  if (process.env.BABEL_ENV == null) {
    process.env.BABEL_ENV = WebapckMode;
  }

  const isEnvProduction = WebapckMode === "production";
  const isEnvDevelopment = !isEnvProduction;
  const outputAssetFileName = isEnvDevelopment ? "[name].[hash].[ext]" : "[contenthash:8][ext][query]";

  const shouldUseSourceMap = true;
  const BabelLoaderOptions = {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    // See #6846 for context on why cacheCompression is disabled
    cacheCompression: false,
    compact: isEnvProduction,
    // Babel sourcemaps are needed for debugging into node_modules
    // code.  Without the options below, debuggers like VSCode
    // show incorrect code and set breakpoints on the wrong lines.
    sourceMaps: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    inputSourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
  };

  // style files regexes
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;
  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const useTailwind = fs.existsSync(
    path.join(__dirname, "tailwind.config.js"),
  );

  const getStyleLoaders = (cssOptions: object, preProcessor?: string): webpack.RuleSetUseItem[] => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: !(useTailwind)
              ? [
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                "postcss-normalize",
              ]
              : [
                "tailwindcss",
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
              ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean) as webpack.RuleSetUseItem[];
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: path.join(configBasePath, "src"),
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            lessOptions: preProcessor === "less-loader" ? {} : undefined,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          },
        },
      );
    }
    return loaders;
  };

  const webpackConfig: webpack.Configuration = {
    mode: isEnvProduction ? "production" : "development",
    devtool: !isEnvProduction ? "inline-source-map" : undefined,
    context: configBasePath,
    devServer: !isEnvProduction
      ? {
        historyApiFallback: {
          rewrites: [{ from: /./, to: "/index.html" }],
        },
        devMiddleware: {
          publicPath: config.dev.publicPath,
        },
        open: false,
        host: "127.0.0.1",
        port: config.dev.port,
        /**
         * No, This can break HRM!!!
         */
        // watchFiles: [path.join(configBasePath, "src/**/*")],
      }
      : undefined,

    infrastructureLogging: !isEnvProduction
      ? {
        level: "warn",
      }
      : undefined,

    stats: !isEnvProduction
      ? true
      : undefined,

    entry: path.join(configBasePath, "src/main.tsx"),

    output: {
      path: path.join(configBasePath, config.outputDir),
      publicPath: isEnvProduction ? config.dev.publicPath : config.build.publicPath,
      filename: `js/[name]${isEnvProduction ? ".[contenthash:8]" : ""}.js`,
      chunkFilename: `js/[name]${isEnvProduction ? ".[contenthash:8]" : ""}.chunk.js`,
    },

    optimization: {
      minimize: !isEnvProduction ? false : true,
      minimizer: !isEnvProduction ? undefined : [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 2018,
            },
            compress: {
              ecma: 5,
              // turn off flags with small gains to speed up minification
              arrows: false,
              collapse_vars: false, // 0.3kb
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,

              // a few flags with noticable gains/speed ratio
              // numbers based on out of the box vendor bundle
              booleans: true, // 0.7kb
              if_return: true, // 0.4kb
              sequences: true, // 0.7kb
              unused: true, // 2.3kb

              // required features to drop conditional branches
              conditionals: true,
              dead_code: true,
              evaluate: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          parallel: true,
          extractComments: false,
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
      moduleIds: "deterministic",
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
            name: `chunk-vendors`,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: "initial",
          },
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: "initial",
            reuseExistingChunk: true,
          },
        },
      },
    },

    resolve: {
      alias: {
        "@": path.join(configBasePath, "src"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(path.join(configBasePath, "src"), [
          path.join(configBasePath, "package.json"),
          reactRefreshRuntimeEntry,
          reactRefreshWebpackPluginRuntimeEntry,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
    },

    plugins: [
      new ESLintPlugin({
        emitError: true,
        emitWarning: true,
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        formatter: require("eslint-formatter-friendly"),
      }),
      new HtmlWebpackPlugin({
        template: path.join(configBasePath, "public/index.html"),
        inject: "body",
        ... (isEnvProduction ? {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        } : undefined),
      }),
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, isEnvDevelopment ? config.dev : config.build),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(configBasePath),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(configBasePath, "public"),
            toType: "dir",
            globOptions: {
              ignore: [".DS_Store", "**/index.html", "**/node/modules"],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
      new DefinePlugin({
        "process.env.BASE_URL": JSON.stringify(WebapckMode === "development" ? `127.0.0.1:${config.dev.port}` : `/`),
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.env.PUBLIC_PATH": JSON.stringify(WebapckMode === "development" ? config.dev.publicPath : config.build.publicPath),
      }),
      /**
       * ts-loader设置了transpileOnly加速webpack的编译，但是类型检查需要另外启动
       */
      new ForkTsCheckerWebpackPlugin(),
      isEnvProduction ? new MiniCssExtractPlugin({
        filename: `css/[name].[contenthash:8].css`,
        chunkFilename: `css/[name].[contenthash:8].chunk.css`,
      }) : new webpack.HotModuleReplacementPlugin({
        // Options...
      }),
      isEnvDevelopment && new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: isEnvDevelopment ? config.dev.publicPath : config.build.publicPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith(".map"),
          );
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ].filter(Boolean) as webpack.WebpackPluginInstance[],

    module: {
      strictExportPresence: true,

      rules: [
        // Handle node_modules packages that contain sourcemaps
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve("source-map-loader"),
        },
        {
          oneOf: [

            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
              type: "asset",
              generator: { filename: `img/${outputAssetFileName}` },
            },

            // This takes svg as a react compenent.
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve("@svgr/webpack"),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },

            // media
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              type: "asset",
              generator: { filename: `media/${outputAssetFileName}` },
            },

            // fonts
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
              type: "asset",
              generator: { filename: `fonts/${outputAssetFileName}` },
            },

            // babel
            {
              test: /\.m?jsx?$/,
              use: [require.resolve("thread-loader"), { loader: require.resolve("babel-loader"), options: BabelLoaderOptions }],
              exclude: (file) => {
                // always transpile js in vue files
                if (/\.vue\.jsx?$/.test(file)) {
                  return false;
                }
                // Don"t transpile node_modules
                return /node_modules/.test(file);
              },
            },

            // ts
            {
              test: /\.tsx?$/,
              use: [
                require.resolve("thread-loader"),
                { loader: require.resolve("babel-loader"), options: BabelLoaderOptions },
                {
                  loader: require.resolve("ts-loader"), options: {
                    transpileOnly: true,
                    /**
                     * 注：If you're using HappyPack or thread-loader with ts-loader, you need use the string type for the regular expressions, not RegExp object.
                     */
                    happyPackMode: true,
                  },
                },
              ],
            },

            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1 + 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: "icss",
                },
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1 + 1,
                sourceMap: isEnvProduction
                  ? shouldUseSourceMap
                  : isEnvDevelopment,
                modules: {
                  mode: "local",
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3 + 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "icss",
                  },
                },
                "sass-loader",
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3 + 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "local",
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                "sass-loader",
              ),
            },
            {
              test: lessRegex,
              exclude: lessModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3 + 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "icss",
                  },
                },
                "less-loader",
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            {
              test: lessModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3 + 1,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: "local",
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                "less-loader",
              ),
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: "asset/resource",
            },
          ],
        },
      ],
    },
    performance: {
      hints: false,
    },
  };

  return webpackConfig;
};

module.exports = CreateWebpackConfig;
