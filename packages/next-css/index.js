const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoaderConfigFactory = require('./css-loader-config')

module.exports = function withCSS (nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const {dev, isServer} = options
      const {cssModules} = nextConfig
      // Support the user providing their own instance of ExtractTextPlugin.
      // If extractCSSPlugin is not defined we pass the same instance of ExtractTextPlugin to all css related modules
      // So that they compile to the same file in production
      let extractCSSPlugin = nextConfig.extractCSSPlugin || options.extractCSSPlugin

      if(!extractCSSPlugin) {
        extractCSSPlugin = new ExtractTextPlugin({
          filename: 'static/style.css'
        })
        config.plugins.push(extractCSSPlugin)
        options.extractCSSPlugin = extractCSSPlugin
      }

      if(!extractCSSPlugin.options.disable) {
        extractCSSPlugin.options.disable = dev
      }

      const cssLoaderConfig = cssLoaderConfigFactory(config, extractCSSPlugin, {cssModules, dev, isServer})

      options.defaultLoaders.css = cssLoaderConfig()

      config.module.rules.push({
        test: /\.css$/,
        use: options.defaultLoaders.css
      })
      
      if(typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
