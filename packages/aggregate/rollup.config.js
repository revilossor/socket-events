import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import pkg from './package.json'

export default {
  input: 'src/main.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'aggregate'
  },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      brower: true
    }),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: ['node_modules/**']
    })
  ]

}
