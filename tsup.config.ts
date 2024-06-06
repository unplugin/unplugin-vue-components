import type { Options } from 'tsup'

export const tsup: Options = {
  entry: [
    'src/*.ts',
  ],
  format: ['cjs', 'esm'],
  external: ['quasar'],
  dts: true,
  splitting: true,
  clean: true,
  shims: false,
}
