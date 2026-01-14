import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  dts: { tsgo: true },
  exports: true,
  inlineOnly: ['@antfu/utils', 'compare-versions'],
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
