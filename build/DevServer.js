const path = require('path');

process.chdir(path.dirname(__dirname));
require('dotenv').config();
process.env.NODE_ENV = 'development';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.dev');

const PROXY_HOST = process.env.PROXY_DOMAIN_FOR_BROWSER_SYNC;
const APP_NAME = process.env.APP_NAME;
const port = process.env.FRONTEND_PORT;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // It suppress error shown in console, so it has to be set to false.
  quiet: false,
  // It suppress everything except error, so it has to be set to false as well
  // to see success build.
  noInfo: false,
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
  proxy: {
    '*': PROXY_HOST,
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 400,
  },
}).listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at localhost:${port}`);
});
