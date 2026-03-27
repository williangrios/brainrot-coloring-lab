const { withAppBuildGradle } = require('expo/config-plugins')

module.exports = function fixBundleCompression(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('enableBundleCompression')) {
      config.modResults.contents = config.modResults.contents.replace(
        /\s*enableBundleCompression\s*=\s*.*\n/g,
        '\n'
      )
    }
    return config
  })
}
