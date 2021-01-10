import type { Plugin } from 'vite'
import { Options } from './types'
import { Context } from './context'
import { VueTransformer } from './transforms/vue'
import { parseId, resolveOptions } from './utils'

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
  ]

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      ctx.viteConfig = config
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
