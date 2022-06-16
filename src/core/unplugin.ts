import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import chokidar from 'chokidar'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { Options, PublicPluginAPI } from '../types'
import { Context } from './context'
import { shouldTransform, stringifyComponentImport } from './utils'

export default createUnplugin<Options>((options = {}) => {
  const filter = createFilter(
    options.include || [/\.vue$/, /\.vue\?vue/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
  )
  const ctx: Context = new Context(options)

  const api: PublicPluginAPI = {
    async findComponent(name, filename) {
      return await ctx.findComponent(name, 'component', filename ? [filename] : [])
    },
    stringifyImport(info) {
      return stringifyComponentImport(info, ctx)
    },
  }

  return {
    name: 'unplugin-vue-components',
    enforce: 'post',

    api,

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
      configResolved(config: ResolvedConfig) {
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
      configureServer(server: ViteDevServer) {
        ctx.setupViteServer(server)
      },
    },

    webpack(compiler) {
      let addPath: { path: string; type: 'unlink' | 'add' }[] = []
      ctx.setupWatcherWebpack(chokidar.watch(ctx.options.globs), (path: string, type: 'unlink' | 'add') => {
        addPath.push({ path, type })
        process.nextTick(() => {
          compiler.watching.invalidate()
        })
      })
      compiler.hooks.compilation.tap('unplugin-vue-components', (compilation) => {
        if (addPath.length) {
          addPath.forEach(({ path, type }) => {
            if (type === 'unlink')
              compilation.fileDependencies.delete(path)
            else
              compilation.fileDependencies.add(path)
          })
          addPath = []
        }
      })
    },
  }
})
