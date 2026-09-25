import rpBabel from '@rollup/plugin-babel';
import rpTerser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'default',
      // `require()` returns the class itself; `.default` points back at it so
      // the `export default` in the typings holds for CommonJS consumers too.
      footer: 'module.exports.default = module.exports;',
      plugins: [rpTerser()],
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
      plugins: [rpTerser()],
    },
  ],
  plugins: [
    rpBabel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
  ],
};
