const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const WorkboxPlugin = require('workbox-webpack-plugin');

const env = {
  NODE_ENV: '"production"',
};
const pathToClean = ['public/build'];
// the clean options to use
const cleanOptions = {
  root: path.join(__dirname, '../'),
  verbose: true,
  dry: false,
};

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    publicPath: '/build/',
    path: path.join(__dirname, '../public/build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true,
    }),
  },
  devtool: 'none',
  plugins: [
    // new WorkboxPlugin.GenerateSW(),
    new HtmlWebpackPlugin({
      title: 'SaveToDrive',
      template: path.join(__dirname, '../server/views/guest/index.jade'),
      filename: path.join(__dirname, '../public/index.html'),
      chunks: ['guest'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      title: 'SaveToDrive',
      template: path.join(__dirname, '../server/views/app/index.jade'),
      filename: path.join(__dirname, '../server/views/app/index.html'),
      chunks: ['app'],
      inject: 'body',
      chunksSortMode(a, b) {
        const orders = ['manifest', 'vendor', 'app'];
        if (orders.indexOf(a.names[0]) > orders.indexOf(b.names[0])) {
          return 1;
        } else if (orders.indexOf(a.names[0]) < orders.indexOf(b.names[0])) {
          return -1;
        }
        return 0;
      },
    }),
    new CleanWebpackPlugin(pathToClean, cleanOptions),
    // new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        FEATURE_CLOUDS: JSON.stringify(process.env.FEATURE_CLOUDS),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     unused: true,
    //     dead_code: true,
    //     warnings: false,
    //   },
    //   sourceMap: true,
    // }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[md5:contenthash:hex:20].css'),
      allChunks: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // new OptimizeCSSPlugin({
    //  cssProcessorOptions: {
    //    safe: true,
    //  },
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info',
    }),
  ],
  optimization: {
    splitChunks: {
      // CommonsChunkPlugin()
      name: 'vendor',
      minChunks: 2,
    },
  },
});

const CompressionWebpackPlugin = require('compression-webpack-plugin');

// webpackConfig.plugins.push(
//   new CompressionWebpackPlugin({
//     asset: '[path].gz[query]',
//     algorithm: 'gzip',
//     test: new RegExp(`\\.(${['js', 'css'].join('|')})$`),
//     threshold: 10240,
//     minRatio: 0.8,
//   }),
// );

module.exports = webpackConfig;
