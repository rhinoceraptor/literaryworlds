const path = require('path')
const webpack = require('webpack')

console.log(process.env)
module.exports = {
  entry: './client/client.ts',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'WEBSOCKET_HOST'
    ])
  ]
}

