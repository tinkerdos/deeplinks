const { hostname } = require('os');
const path = require('path');

module.exports = (env, argv) => ({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  mode: argv.mode || 'development',
  devtool: 'source-map',
  module: {
    rules: [
      // Add loaders here if needed (e.g., Babel)
    ],
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    static: {
      directory: path.resolve(__dirname),
    },
    compress: true,
    port: 30039,
    open: true,
    hot: true,
  },
  resolve: {
    extensions: ['.js'],
  },
});
