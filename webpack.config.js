/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const resolve = require('path').resolve;
const pkg = require('./package.json');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const now = new Date();
const prefix = (n) => (n < 10 ? '0' + n : n.toString());
const buildId = `${now.getUTCFullYear()}${prefix(now.getUTCMonth() + 1)}${prefix(now.getUTCDate())}-${prefix(
  now.getUTCHours()
)}${prefix(now.getUTCMinutes())}${prefix(now.getUTCSeconds())}`;

const year = new Date().getFullYear();
const banner =
  `/*! ${pkg.title || pkg.name} - v${pkg.version} - ${year}\n` +
  (pkg.homepage ? `* ${pkg.homepage}\n` : '') +
  `* Copyright (c) ${year} ${pkg.author.name}; Licensed ${pkg.license} */\n`;

/**
 * generate a webpack configuration
 */
module.exports = (_env, options) => {
  const dev = options.mode.startsWith('d');
  return {
    node: false, // no polyfills
    entry: dev
      ? {
          LineUpJSx: './src/bundle.ts',
          builder2: './demo/builder2.tsx',
          builder3: './demo/builder3.tsx',
          highlight: './demo/highlight.tsx',
        }
      : {
          LineUpJSx: './src/bundle.ts',
        },
    output: {
      path: resolve(__dirname, 'build'),
      filename: `[name].js`,
      chunkFilename: '[chunkhash].js',
      publicPath: '', //no public path = relative
      library: pkg.global,
      libraryTarget: 'umd',
      umdNamedDefine: false, //anonymous require module
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js'],
      symlinks: false,
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner,
        raw: true,
      }),
      //define magic constants that are replaced
      new webpack.DefinePlugin({
        __DEBUG__: dev,
        __VERSION__: JSON.stringify(pkg.version),
        __LICENSE__: JSON.stringify(pkg.license),
        __BUILD_ID__: JSON.stringify(buildId),
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    externals: {
      //react always external
      react: {
        amd: 'react',
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
      },
      'react-dom': {
        amd: 'react-dom',
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                workers: require('os').cpus().length - 1,
              },
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: dev ? 'tsconfig.dev.json' : 'tsconfig.json',
                happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up  compilation and reduce errors reported to webpack
              },
            },
          ].slice(process.env.CI || !dev ? 1 : 0), // no optimizations for CIs and in production mode
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          // More information here https://webpack.js.org/guides/asset-modules/
          type: 'asset',
        },
        {
          test: /schema\.json$/,
          type: 'javascript/auto',
        },
      ],
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    devServer: {
      static: './demo',
    },
  };
};
