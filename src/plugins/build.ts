import type { Plugin } from 'rollup'
import { isResolverPath, generateResolver } from '../generator/resolver'
import { Context } from '../types'
import { searchComponents } from '../glob'

export function createRollupPlugin(ctx: Context): Plugin {
  return {
    name: 'vite-plugin-components',
    resolveId(source) {
      if (isResolverPath(source))
        return source
      return null
    },
    async load(id) {
      if (isResolverPath(id)) {
        await searchComponents(ctx)
        return await generateResolver(ctx, id)
      }
      return null
    },
  }
}
