import type { ServerPlugin } from 'vite'
import { Context } from '../types'
import { isResolverPath, generateResolver } from '../generator/resolver'
import { searchComponents } from '../glob'

export function createServerPlugin(context: Context): ServerPlugin {
  return ({ app, watcher }) => {
    // TODO: handle HMR use watch

    app.use(async(ctx, next) => {
      if (!isResolverPath(ctx.path))
        return next()

      try {
        await searchComponents(context)
        ctx.body = await generateResolver(context, ctx.path)
        ctx.type = 'js'
        ctx.status = 200
      }
      catch (e) {
        ctx.body = {
          error: e.toString(),
        }
        ctx.type = 'js'
        ctx.status = 500
      }
    })
  }
}
