const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js', // Entry point of your React app
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'index.js', // Output file name
    libraryTarget: 'commonjs2', // Export as a CommonJS module
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile JS/JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Optionally handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions
  },
};