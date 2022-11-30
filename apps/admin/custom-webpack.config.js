const { merge } = require('webpack-merge')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (config, context) => {
  const mergeConfig = merge(config, {
    mode: 'development',
  })
  console.log(mergeConfig.output)

  return mergeConfig
}
