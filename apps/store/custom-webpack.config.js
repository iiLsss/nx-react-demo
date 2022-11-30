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
        // '/assets': {
        //   target: 'https://www13.eeo.im',
        //   changeOrigin: true,
        // },
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
  // console.log(mergeConfig.output)

  return mergeConfig
}
