module.exports = function (config) {
  config.set({
    mutator: 'javascript',
    mutate: [
      'lib/**/*.js'
    ],
    packageManager: 'npm',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    transpilers: [],
    coverageAnalysis: 'off'
  })
}
