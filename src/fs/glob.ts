import fg from 'fast-glob'
import Debug from 'debug'
import { Context } from '../context'

const debug = Debug('vite-plugin-components:glob')

export function searchComponents(ctx: Context) {
  debug(`started with: [${ctx.globs.join(', ')}]`)

  const files = fg.sync(ctx.globs, {
    ignore: ['node_modules'],
    onlyFiles: true,
    cwd: ctx.viteConfig?.root || process.cwd(),
  })

  if (!files.length && !ctx.options.customComponentResolvers?.length)
    console.warn('[vite-plugin-components] no components found')

  debug(`${files.length} components found.`)

  ctx.addComponents(files)
}
