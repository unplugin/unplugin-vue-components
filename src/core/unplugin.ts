import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import chokidar from 'chokidar'
import { Options } from '../types'
import { Context } from './context'
import { shouldTransform } from './utils'

export default createUnplugin<Options>((options = {}) => {
  const filter = createFilter(
    options.include || [/\.vue$/, /\.vue\?vue/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
  )
  const ctx: Context = new Context(options)

  return {
    name: 'unplugin-vue-components',
    enforce: 'post',

    transformInclude(id) {
      return filter(id)
    },

    async transform(code, id) {
      if (!shouldTransform(code))
        return null
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
        ctx.sourcemap = true

        if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
          ctx.setTransformer('vue2')

        if (options.dts) {
          ctx.searchGlob()
          ctx.generateDeclaration()
        }

        if (config.build.watch && config.command === 'build')
          ctx.setupWatcher(chokidar.watch(ctx.options.globs))
      },
      configureServer(server) {
        ctx.setupViteServer(server)
      },
    },
  }
})
