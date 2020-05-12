import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';

import * as draftJs from 'draft-js';
import * as immutableJs from 'immutable';

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
    {
      file: pkg.browser,
      format: 'umd',
      name: '{{packageName}}',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
      },
    },
  ],
  external: [
    'events',
    'react',
    'react-dom',
    'prop-types',
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
    resolve(),
    commonjs({
      namedExports: {
        'draft-js': Object.keys(draftJs),
        'immutable': Object.keys(immutableJs),
      },
      exclude: ['node_modules/symbol-observable/es/*.js'],
    }),
    terser(),
  ],
};
