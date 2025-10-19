import type { Context } from '../context'
import Debug from 'debug'
import { globSync } from 'tinyglobby'

const debug = Debug('unplugin-vue-components:glob')

export function searchComponents(ctx: Context) {
  debug(`started with: [${ctx.options.globs.join(', ')}]`)
  const root = ctx.root
  const files = globSync(ctx.options.globs, {
    ignore: ctx.options.globsExclude,
    onlyFiles: true,
    cwd: root,
    absolute: true,
    expandDirectories: false,
  })

  if (!files.length && !ctx.options.resolvers?.length)

    console.warn('[unplugin-vue-components] no components found')

  debug(`${files.length} components found.`)

  ctx.addComponents(files)
}
