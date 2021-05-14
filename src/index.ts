import type { Plugin } from 'vite'
import { Options, Transformer } from './types'
import { Context } from './context'
import { parseId } from './utils'
import { getMatchingTranformer } from './transforms/transformers';

function VitePluginComponents(options: Options = {}): Plugin {
  let ctx: Context
  let transformer: Transformer

  return {
    name: 'vite-plugin-components',
    enforce: 'post',
    configResolved(config) {
      ({transformer, ctx} = getMatchingTranformer(config, options))
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
