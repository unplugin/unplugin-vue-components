import fg from 'fast-glob'
import Debug from 'debug'
import type { Context } from '../context'

const debug = Debug('unplugin-vue-components:glob')

export function searchComponents(ctx: Context) {
  debug(`started with: [${ctx.options.globs.join(', ')}]`)
  const root = ctx.root

  const files = fg.sync(ctx.options.globs, {
    ignore: ['node_modules'],
    onlyFiles: true,
    cwd: root,
    absolute: true,
  })

  if (!files.length && !ctx.options.resolvers?.length)

    console.warn('[unplugin-vue-components] no components found')

  debug(`${files.length} components found.`)

  ctx.addComponents(files)
}
