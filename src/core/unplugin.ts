import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { Options } from '../types'
import { Context } from './context'

export default createUnplugin<Options>((options = {}) => {
  const filter = createFilter(
    options.include || [/\.vue$/, /\.vue\?vue&type=template/],
    options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
  )
  const ctx: Context = new Context(options)

  return {
    name: 'unplugin-vue-components',
    enforce: 'post',

    transformInclude(id) {
      return filter(id)
    },

    async transform(code, id) {
      try {
        const result = await ctx.transform(code, id)
        ctx.generateDeclaration()
        return result
      }
      catch (e) {
        this.error(e)
      }
    },

    vite: {
      configResolved(config) {
        ctx.setRoot(config.root)
        ctx.sourcemap = config.build.sourcemap

        if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
          ctx.setTransformer('vue2')

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
