const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (config, context) => {
  return merge(config, {
    // plugins: [
    //   new HtmlWebpackPlugin({
    //     filename: (filename) => `${filename}.html`,
    //     template: './src/index.html',
    //     inject: true,
    //   }),
    // ],
  })
}
