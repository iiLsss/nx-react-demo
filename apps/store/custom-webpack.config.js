const { merge } = require('webpack-merge')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (config, context) => {
  const mergeConfig = merge(config, {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://mock.mengxuegu.com',
          changeOrigin: true,
          pathRewrite: {
            '/api': '/',
          },
        },
      },
    },
    // plugins: [
    //   new HtmlWebpackPlugin({
    //     filename: (filename) => `${filename}.html`,
    //     template: './src/index.html',
    //     inject: true,
    //   }),
    // ],
  })
  console.log(mergeConfig.devServer)

  return mergeConfig
}
