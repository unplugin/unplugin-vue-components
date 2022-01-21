import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import chokidar from 'chokidar'
import Debug from 'debug'
import type { ResolvedConfig, UserConfig, ViteDevServer } from 'vite'
import type { ComponentInfo, Options } from '../types'
import { Context } from './context'
import { shouldTransform } from './utils'

const debug = Debug('unplugin-vue-components:unplugin')

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
      config(config: UserConfig) {
        if (ctx.options.preBuild) {
          ctx.options.resolvers.forEach((r) => {
            if (r.getAllComponentNames) {
              const allComponentNames = r.getAllComponentNames()
              const resolvedNames = allComponentNames
                .map((name) => {
                  const componentInfo = r.resolve(name) as ComponentInfo
                  debug(componentInfo)

                  const fullPath = componentInfo.name ? `${componentInfo.path}/${componentInfo.name}` : componentInfo.path

                  const sideEffects = (componentInfo?.sideEffects as string) || ''

                  return [fullPath, sideEffects]
                })
                .flat()
              config.optimizeDeps = config.optimizeDeps || {}
              config.optimizeDeps.include = Array.from(new Set([...(config.optimizeDeps.include || []), ...resolvedNames]))
              config.optimizeDeps.include.sort()
            }
          })
        }
      },
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
  }
})
