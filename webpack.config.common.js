/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const context = path.join(__dirname, 'src', 'views');

const paths = {
  main: path.join(context, 'client.entry.tsx'),
  server: path.join(context, 'server.entry.tsx'),
  public: path.join(__dirname, 'dist', 'public'),
};

const common = {
  context,
  cache: true,
  devtool: 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  output: {
    filename: '[name].js',
    path: paths.public,
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: '@svgr/webpack' }],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: 'ts-loader',
      },
    ],
  },
};

module.exports = { config: common, paths };
