import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/main.js',
  output: [
    { file: pkg.main, format: 'umd', name: 'aggregate' }
  ],
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: [['@babel/preset-env', { modules: false }]],
      exclude: ['node_modules/**']
    })
  ]

}
