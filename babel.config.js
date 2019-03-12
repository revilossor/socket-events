// this is just for jest
module.exports = function (api) {
  api.cache(false)
  const presets = ['@babel/env']
  const plugins = ['@babel/plugin-transform-runtime']
  return {
    presets,
    plugins,
    babelrcRoots: 'packages/*'
  }
}
