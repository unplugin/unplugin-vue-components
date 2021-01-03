import type { Plugin } from 'vite'
import { Options } from './types'
import { Context } from './context'
import { VueTransformer } from './transforms/vue'
import { CustomComponentTransformer } from './transforms/customComponent'
import { parseId, resolveOptions } from './utils'
import { generateResolver, isResolverPath } from './generator/importer'

const defaultOptions: Required<Options> = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,

  directoryAsNamespace: false,
  globalNamespaces: [],

  libraries: [],

  customLoaderMatcher: () => false,
  customComponentResolvers: [],
}

function VitePluginComponents(options: Options = {}): Plugin {
  const ctx: Context = new Context(resolveOptions(options, defaultOptions))

  const transformer = [
    VueTransformer(ctx),
    CustomComponentTransformer(ctx),
  ]

  return {
    name: 'vite-plugin-components',
    resolveId(source) {
      if (isResolverPath(source))
        return source
      return null
    },
    configResolved(config) {
      ctx.viteConfig = config
    },
    async load(id) {
      if (isResolverPath(id)) {
        await ctx.searchGlob()
        return await generateResolver(ctx, id.slice(1)) // remove the heading '/'
      }
      return null
    },
    transform(code, id) {
      const { path, query } = parseId(id)
      for (const trans of transformer)
        code = trans(code, id, path, query)

      return code
    },
  }
}

export * from './helpers/libraryResolver'
export * from './types'
export { camelCase, pascalCase, kebabCase } from './utils'
export default VitePluginComponents
