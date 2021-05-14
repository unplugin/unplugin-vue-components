import type { Plugin } from 'vite'
import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { getTranformer } from './transforms/transformers';

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformer: Transformer

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      if (config.plugins.find(i => i.name === 'vite-plugin-vue2')) {
        options.transformer = options.transformer || 'vue2'
      }
      else if (config.plugins.find(i => i.name === 'vite-plugin-svelte')) {
        options.transformer = options.transformer || 'svelte3'

        if (options.extensions) {
          if (typeof options.extensions === 'string') {
            // convert to array
            options.extensions = [options.extensions]
          }
          options.extensions.push('svelte')
        }
        else {
          options.extensions = 'svelte'
        }
      }

      ctx = new Context(options, config)
      transformer = getTranformer(ctx)
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
