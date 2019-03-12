import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import pkg from './package.json'

export default {
  input: 'src/main.js',
  external: [ 'socket.io-client' ],
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'aggregate',
    globals: {
      'socket.io-client': 'io'
    }
  },
  plugins: [
    builtins(),
    resolve({
      preferBuiltins: false,
      jsnext: true,
      main: true,
      brower: true
    }),
    commonjs(),
    babel({
      babelrc: false,
      runtimeHelpers: true,
      plugins: ['@babel/plugin-transform-runtime'],
      presets: [['@babel/preset-env', { modules: false }]],
      exclude: ['node_modules/**']
    })
  ]

}
