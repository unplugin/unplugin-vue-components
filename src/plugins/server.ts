import type { ServerPlugin } from 'vite'
import Debug from 'debug'
import { isResolverPath, generateResolver } from '../generator/resolver'
import { Context } from '../context'
import { matchGlobs, relative } from '../utils'

const debug = {
  add: Debug('vite-plugin-components:watcher:add'),
  remove: Debug('vite-plugin-components:watcher:del'),
  hmr: Debug('vite-plugin-components:watcher:hmr'),
}

export function createServerPlugin(ctx: Context): ServerPlugin {
  return ({ app, watcher }) => {
    function reloadPage() {
      watcher.send({
        type: 'full-reload',
        path: '/',
      })
    }

    watcher.on('add', (e) => {
      const path = relative(e)
      if (matchGlobs(path, ctx.globs)) {
        debug.add(path)
        if (ctx.addComponents(path))
          reloadPage()
      }
    })

    watcher.on('unlink', (e) => {
      const path = relative(e)
      if (matchGlobs(path, ctx.globs)) {
        debug.remove(path)
        if (ctx.removeComponents(path))
          reloadPage()
      }
    })

    app.use(async(koa, next) => {
      if (!isResolverPath(koa.path))
        return next()

      try {
        await ctx.searchGlob()
        koa.body = await generateResolver(ctx, koa.path)
        koa.type = 'js'
        koa.status = 200
      }
      catch (e) {
        koa.body = {
          error: e.toString(),
        }
        koa.type = 'json'
        koa.status = 500
      }
    })
  }
}
