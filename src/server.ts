import type { ServerPlugin } from 'vite'
import { Options } from './options'
import { MODULE_NAME } from './constants'
import { generate } from './generator'

export function createServerPlugin(options: Options): ServerPlugin {
  return ({ app }) => {
    app.use(async(ctx, next) => {
      if (ctx.path !== `/@modules/${MODULE_NAME}/dist/index.mjs`)
        return next()

      try {
        ctx.body = await generate(options)
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
