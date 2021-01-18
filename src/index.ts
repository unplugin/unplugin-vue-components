import type { Plugin } from 'vite'
import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { VueTransformer } from './transforms/vue'

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformers: Transformer[]

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      ctx = new Context(options, config)
      transformers = [
        VueTransformer(ctx),
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
