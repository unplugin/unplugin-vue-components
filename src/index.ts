import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { getTransformer } from './transformers'
import type { Plugin } from 'vite'

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformer: Transformer

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
        options.transformer = options.transformer || 'vue2'
      else if (config.plugins.find(i => i.name === 'vite-plugin-svelte'))
        options.transformer = options.transformer || 'svelte313'

      ctx = new Context(options, config)
      transformer = getTransformer(ctx)
    },
    configureServer(server) {
      ctx.setServer(server)
    },
    transform(code, id) {
      const { path, query } = parseId(id)
      return transformer(code, id, path, query)
    },
  }
}

export * from './helpers/libraryResolver'
export * from './types'
export * from './resolvers'
export { camelCase, pascalCase, kebabCase } from './utils'
export default VitePluginComponents
