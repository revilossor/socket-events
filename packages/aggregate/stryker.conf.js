module.exports = function (config) {
  config.set({
    mutator: 'javascript',
    mutate: [
      'src/**/*.js'
    ],
    packageManager: 'npm',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    transpilers: [],
    timeoutFactor: 1,
    timeoutMS: 1000,
    coverageAnalysis: 'off'
  })
}
