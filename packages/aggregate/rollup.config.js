import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/Aggregate.js',
  output: [
    { file: pkg.main, format: 'umd', name: 'Aggregate' }
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
