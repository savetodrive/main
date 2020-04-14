require('dotenv').config();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const fs = require('fs');
const webpackConfig = require('./webpack.config.prod');

const spinner = ora('building for production...');

spinner.start();
webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err) throw err;

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`,
  );

  console.log(chalk.cyan('  Build complete.\n'));
  console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' + "  Opening index.html over file:// won't work.\n"));
  fs.writeFileSync('webpack-stats.json', JSON.stringify(stats.toJson()));
});
