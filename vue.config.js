module.exports = {
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