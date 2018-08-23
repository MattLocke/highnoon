const webpack = require('webpack')

module.exports = {
  assetsDir: 'assets',
  runtimeCompiler: true,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ExternalsPlugin('./serviceworker-webpack-plugin', 'serviceworker-webpack-plugin')
    ]
  }
}