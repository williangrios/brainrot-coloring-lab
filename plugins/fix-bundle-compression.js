const { withAppBuildGradle } = require('expo/config-plugins')

module.exports = function fixBundleCompression(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents

    // Remove any existing enableBundleCompression setting (both formats)
    contents = contents.replace(/[ \t]*enableBundleCompression\s*[=:]\s*\S+[ \t]*\n/g, '')

    // Handle React Native 0.71+ format: react { ... }
    if (contents.match(/\breact\s*\{/)) {
      contents = contents.replace(
        /(\breact\s*\{)/,
        '$1\n        enableBundleCompression = false'
      )
    }
    // Handle older format: project.ext.react = [...]
    else if (contents.match(/project\.ext\.react\s*=\s*\[/)) {
      contents = contents.replace(
        /(project\.ext\.react\s*=\s*\[)/,
        '$1\n        enableBundleCompression: false,'
      )
    }
    // Fallback: inject before android { block
    else {
      contents = contents.replace(
        /(\bandroid\s*\{)/,
        'project.ext.react = [\n    enableBundleCompression: false\n]\n\n$1'
      )
    }

    config.modResults.contents = contents
    return config
  })
}
