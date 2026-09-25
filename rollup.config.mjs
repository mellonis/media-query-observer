import rpBabel from '@rollup/plugin-babel';
import rpTerser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'default',
    plugins: [rpTerser()],
  },
  plugins: [
    rpBabel({ babelHelpers: 'bundled' }),
  ],
};
