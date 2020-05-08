import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import postcss from 'rollup-plugin-postcss';
import reactSvg from 'rollup-plugin-react-svg';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';
import svgr from '@svgr/rollup';

import * as draftJs from 'draft-js';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: [
    'events',
  //   'react',
  //   'react-dom',
  //   'prop-types',
  ],
  plugins: [
    external(),
    postcss({
      modules: true,
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
    }),
    // nodePolyfills(),
    resolve(),
    commonjs({
      namedExports: {
        'draft-js': Object.keys(draftJs),
      },
      exclude: ['node_modules/symbol-observable/es/*.js'],
    }),
    // terser(),
  ],
};
