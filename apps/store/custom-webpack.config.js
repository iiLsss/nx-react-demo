const { merge } = require('webpack-merge')
const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (config, context) => {
  const mergeConfig = merge(config, {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        // Utilities: path.resolve(__dirname, 'src/utilities/'),
        // Templates: path.resolve(__dirname, 'src/templates/'),
      },
    },
    devServer: {
      proxy: {
        '/api': {
          target: 'https://mock.mengxuegu.com',
          changeOrigin: true,
          pathRewrite: {
            '/api': '/',
          },
        },
        '/assets': {
          target: 'https://www13.eeo.im',
          changeOrigin: true,
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

  return mergeConfig
}
