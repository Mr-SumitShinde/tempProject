npm install --save-dev webpack webpack-cli ts-loader webpack-node-externals

nx generate @nrwl/web:webpack --project valpre-api

npm install stream-http https-browserify url

const webpack = require('webpack');

module.exports = {
  // other webpack configurations
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ]
};