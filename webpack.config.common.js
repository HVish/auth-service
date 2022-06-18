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
  devtool: 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  output: {
    filename: '[name].js',
    path: paths.public,
  },

  resolve: {
    extensions: ['.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
};

module.exports = { config: common, paths };
