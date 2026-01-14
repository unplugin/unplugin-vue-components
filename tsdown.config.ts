import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  exports: true,
  inlineOnly: [
    '@antfu/utils',
    'compare-versions',
    'estree-walker',
    'minimatch',
    '@isaacs/brace-expansion',
    '@isaacs/balanced-match',
  ],
  external: [
    // dts
    'webpack',
    'esbuild',
    'rollup',
    'rolldown',
    'vite',
    '@nuxt/schema',
  ],
})
