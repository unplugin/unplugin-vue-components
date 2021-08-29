import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { Options } from '../types'
import { Context } from './context'
import { parseId } from './utils'
import { Vue3Transformer } from './transforms/vue3'
import { Vue2Transformer } from './transforms/vue2'

export default createUnplugin<Options>((options = {}) => {
  const filter = createFilter(
    options.include || [/\.vue$/, /\.vue\?vue/],
    options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
  )
  const ctx: Context = new Context(options)
  let transformer = ctx.options.transformer === 'vue2'
    ? Vue2Transformer(ctx)
    : Vue3Transformer(ctx)

  return {
    name: 'unplugin-vue-components',
    enforce: 'post',

    transformInclude(id) {
      return filter(id)
    },

    async transform(code, id) {
      const { path, query } = parseId(id)
      const result = await transformer(code, id, path, query)
      ctx.generateDeclaration()
      return result
    },

    vite: {
      configResolved(config) {
        ctx.setRoot(config.root)
        ctx.sourcemap = config.build.sourcemap

        if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
          options.transformer = options.transformer || 'vue2'

        transformer = ctx.options.transformer === 'vue2'
          ? Vue2Transformer(ctx)
          : Vue3Transformer(ctx)

        if (options.dts) {
          ctx.searchGlob()
          ctx.generateDeclaration()
        }
      },
      configureServer(server) {
        ctx.setViteServer(server)
      },
    },
  }
})
