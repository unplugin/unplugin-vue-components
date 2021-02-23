import type { Plugin } from 'vite'
import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { Vue3Transformer } from './transforms/vue3'
import { Vue2Transformer } from './transforms/vue2'

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformers: Transformer[]

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      ctx = new Context(options, config)
      transformers = [
        ctx.options.transformer === 'vue2'
          ? Vue2Transformer(ctx)
          : Vue3Transformer(ctx),
      ]
    },
    configureServer(server) {
      ctx.setServer(server)
    },
    transform(code, id) {
      const { path, query } = parseId(id)
      for (const trans of transformers)
        code = trans(code, id, path, query)

      return code
    },
  }
}

export * from './helpers/libraryResolver'
export * from './types'
export { camelCase, pascalCase, kebabCase } from './utils'
export default VitePluginComponents
