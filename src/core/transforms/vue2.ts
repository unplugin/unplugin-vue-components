import Debug from 'debug'
import MagicString from 'magic-string'
import { TransformResult } from 'unplugin'
import { Transformer } from '../../types'
import { DISABLE_COMMENT } from '../constants'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('unplugin-vue-components:transform:vue2')

export function Vue2Transformer(ctx: Context): Transformer {
  return async(code, id, path, query) => {
    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const head: string[] = []
    let no = 0
    const componentPaths: string[] = []

    const s = new MagicString(code)

    for (const match of code.matchAll(/_c\([\s\n\t]*['"](.+?)["']([,)])/g)) {
      const [full, matchedName, append] = match

      if (match.index != null && matchedName && !matchedName.startsWith('_')) {
        const start = match.index
        const end = start + full.length
        debug(`| ${matchedName}`)
        const name = pascalCase(matchedName)
        componentPaths.push(name)
        const component = await ctx.findComponent(name, [sfcPath], matchedName)
        if (component) {
          const var_name = `__unplugin_components_${no}`
          head.push(stringifyComponentImport({ ...component, name: var_name }, ctx))
          no += 1
          s.overwrite(start, end, `_c(${var_name}${append}`)
        }
      }
    }

    debug(`^ (${no})`)

    ctx.updateUsageMap(sfcPath, componentPaths)

    if (!head.length)
      return null

    s.prepend(`${DISABLE_COMMENT}${head.join(';')};`)

    const result: TransformResult = { code: s.toString() }
    if (ctx.sourcemap)
      result.map = s.generateMap({ hires: true })
    return result
  }
}
