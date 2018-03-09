import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'lib/index.js',
  output: {
    format: 'cjs',
    file: 'dist/index.js',
  },
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: [['env', { modules: false }], 'stage-0'],
      plugins: ['external-helpers'],
    }),
    filesize(),
  ],
}
