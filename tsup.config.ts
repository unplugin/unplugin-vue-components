import type { Options } from 'tsup'

export const tsup: Options = {
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
}
