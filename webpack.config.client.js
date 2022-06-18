/* eslint-disable @typescript-eslint/no-var-requires */
const { paths, config } = require('./webpack.config.common');

const client = {
  ...config,
  target: 'web',
  entry: { main: paths.main },
};

module.exports = client;
