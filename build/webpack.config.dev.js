/* global require,module */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

Object.keys(webpackBaseConfig.entry).forEach((item) => {
  if (Array.isArray(webpackBaseConfig.entry[item])) {
    webpackBaseConfig.entry[item].unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:3001');
    webpackBaseConfig.entry[item].push('webpack/hot/dev-server');
  }
});
module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    publicPath: '/build/',
    path: path.join(__dirname, '../public/build'),
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  devtool: '#eval-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'eslint-loader',
        include: /(src)/,
        options: {
          formatter: require('eslint-friendly-formatter'),
          configFile: './.eslintrc', // your .eslintrc file
          emitWarning: true,
          emitError: true,
          failOnWarning: false,
          failOnError: false,
        },
      },
      {
        test: /(\.css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([path.join(__dirname, '../node_modules')]),
    new webpack.DefinePlugin({
      'process.env': {
        FEATURE_CLOUDS: JSON.stringify(process.env.FEATURE_CLOUDS),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      // CommonsChunkPlugin()
      name: 'vendor',
      minChunks: 2,
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
  },
});
