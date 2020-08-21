import type { Plugin } from 'rollup'
import { isResolverPath, generateResolver } from '../generator/resolver'
import { searchComponents } from '../fs/glob'
import { Context } from '../context'

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
