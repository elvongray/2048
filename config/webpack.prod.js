const path = require('path');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
  target: 'web',

  devtool: 'source-map',

  output: {
    path: path.join(__dirname, '..', 'dist'),

    filename: '[name].[chunkhash].bundle.js',

    sourceMapFilename: '[name].[chunkhash].bundle.map',

    chunkFilename: '[id].[chunkhash].chunk.js',
  },

  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
});
