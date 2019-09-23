import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const outputs = [['src/index.js', pkg], ['es5/index.js', pkg.es5]];

export default outputs
  .map(([input, outputs]) => [
    {
      input,
      output: {
        name: 'CSSinJSON',
        file: outputs.browser,
        format: 'iife',
        exports: 'named'
      },
      plugins: [
        resolve(),
        commonjs(),
        terser(),
        replace({
          const: 'let'
        }),
        sizeSnapshot()
      ]
    },
    {
      input,
      external: [],
      output: [
        { file: outputs.main, format: 'cjs', exports: 'named' },
        { file: outputs.module, format: 'es', exports: 'named' }
      ]
    }
  ])
  .reduce((a, b) => [...a, ...b], []);
