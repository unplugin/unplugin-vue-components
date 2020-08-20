import type { Plugin } from 'rollup'
import { MODULE_NAME } from './constants'
import { generate } from './generator'
import { Options } from './options'

export function createRollupPlugin(options: Options): Plugin {
  return {
    name: 'vite-plugin-components',
    resolveId(source) {
      if (source === MODULE_NAME)
        return source
      return null
    },
    async load(id) {
      if (id === MODULE_NAME)
        return await generate(options)
      return null
    },
  }
}
