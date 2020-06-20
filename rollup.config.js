import rpBabel from '@rollup/plugin-babel';
import { terser as rpTerser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    plugins: [rpTerser()],
  },
  plugins: [
    rpBabel(),
  ],
};
