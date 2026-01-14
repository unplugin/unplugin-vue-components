import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  dts: true,
  exports: true,
  inlineOnly: [
    '@antfu/utils',
    'compare-versions',
    'estree-walker',
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
