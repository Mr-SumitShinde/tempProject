const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',  // Adjust based on your project's entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',  // This ensures the library can be consumed in multiple environments
    globalObject: 'this',  // Ensures compatibility with both Node.js and browser environments
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Resolve TypeScript and JavaScript files
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/"),
      "process": require.resolve("process/browser")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',  // Ensure `process` is available for browser polyfills
    }),
  ],
  devtool: 'source-map',  // Optional: Useful for debugging
  mode: 'production'  // You can change this to 'development' when needed
};