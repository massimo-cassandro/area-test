import terser  from '@rollup/plugin-terser';
import node_resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';


export default [
  {
    input: './src/la-ruota-dei.js',
    plugins: [
      node_resolve(),
      // commonjs(),
      terser({ compress: { passes: 2 } }),
    ],
    output: [
      {
        file: './build/la-ruota-dei.min.js',
        format: 'iife',
        sourcemap: true,

        // banner:
        // footer:
      }
    ]
  }
];

