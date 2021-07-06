import type { Plugin } from 'vite'
import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { Vue3Transformer } from './transforms/vue3'
import { Vue2Transformer } from './transforms/vue2'

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformer: Transformer

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
        options.transformer = options.transformer || 'vue2'

      ctx = new Context(options, config)
      transformer = ctx.options.transformer === 'vue2'
        ? Vue2Transformer(ctx)
        : Vue3Transformer(ctx)

      if (options.globalComponentsDeclaration) {
        ctx.searchGlob()
        ctx.generateDeclaration()
      }
    },
    configureServer(server) {
      ctx.setServer(server)
    },
    async transform(code, id) {
      const { path, query } = parseId(id)
      const result = await transformer(code, id, path, query)
      ctx.generateDeclaration()
      return result
    },
  }
}

export * from './helpers/libraryResolver'
export * from './types'
export * from './resolvers'
export { camelCase, pascalCase, kebabCase } from './utils'
export default VitePluginComponents
