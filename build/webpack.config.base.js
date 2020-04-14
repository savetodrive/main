const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const utils = require('./utils');

module.exports = {
  entry: {
    guest: [path.resolve(__dirname, '../src/index')],
    app: [path.resolve(__dirname, '../src/app/index')],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: /(src|auto-bind|antd)/,
        exclude: /server/,
        options: {
          presets: [['env', { modules: false, targets: { node: true } }]],
          plugins: ['lodash'],
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              javascriptEnabled: true,
            },
          },
        ],
        // ...other rules
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: { name: '[name].[hash].js', fallback: true },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
      { test: /\.jade$/, loader: 'jade-loader' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      NProgress: 'nprogress',
    }),
    // new LodashModuleReplacementPlugin({
    //  currying: true,
    //  paths: true,
    //  shorthands: true,
    //  collections: true,
    // }),
  ],
  resolve: {
    extensions: ['.js'],
    modules: ['.', 'node_modules'],
    alias: {
      debug: 'debug/src/browser.js',
      utils: path.join(__dirname, '../src/Utils'),
      guest: path.join(__dirname, '../src/guest'),
      app: path.join(__dirname, '../src/app'),
      components: path.join(__dirname, '../src/components'),
      api: path.join(__dirname, '../src/api'),
      src: path.join(__dirname, '../src'),
      consts: path.join(__dirname, '../src/consts'),
    },
  },
  target: 'web',
  output: {
    globalObject: 'this',
  },
};
