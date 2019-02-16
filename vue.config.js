module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    module: {
      // loaders will get concatenated!
      rules: [
        {
          test: /\.pug?$/,
          loader: 'pug-plain-loader'
        }
      ]
    }
  }
}
