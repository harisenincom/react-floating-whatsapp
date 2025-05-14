import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
// import copy from 'rollup-plugin-copy';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

// Read package.json as ES module
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default {
  input: 'src/index.tsx',
  plugins: [
    peerDepsExternal(),
    commonjs(),
    resolve(),
    postcss({
      minimize: true,
      plugins: [autoprefixer()]
    }),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.mp3', '**/*.webp'],
      limit: 99000,
      emitFiles: true
    }),
    // copy({
    //   targets: [{ src: 'src/Components/assets', dest: 'dist' }]
    // }),
    typescript(),
    terser()
  ],
  output: {
    file: packageJson.main,
    format: 'esm',
    sourcemap: true
  }
}
