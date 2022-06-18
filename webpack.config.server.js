/* eslint-disable @typescript-eslint/no-var-requires */
const { paths, config } = require('./webpack.config.common');
const nodeExternals = require('webpack-node-externals');

const server = {
  ...config,
  target: 'node',
  entry: { server: paths.server },
  output: {
    filename: '[name].js',
    path: paths.public,
    library: {
      name: 'main',
      type: 'commonjs'
    }
  },
  externals: [nodeExternals()],
};

module.exports = server;
