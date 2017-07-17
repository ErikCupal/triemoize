const resolve = require('path').resolve
const webpack = require('webpack')

const config = {
  entry: [
    './es6/index.js',
  ],

  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist/'),
    library: 'triemoize',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              'presets': [
                [
                  'latest',
                  {
                    'modules': false
                  }
                ]
              ]
            }
          }
        ]
      },
    ]
  },

  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
}

module.exports = config