import type { Plugin } from 'rollup'
import { isResolverPath, generateResolver } from '../generator/resolver'
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
        await ctx.searchGlob()
        return await generateResolver(ctx, id.slice(1)) // remove the heading '/'
      }
      return null
    },
  }
}
