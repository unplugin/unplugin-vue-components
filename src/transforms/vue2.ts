import Debug from 'debug'
import MagicString from 'magic-string'
import { TransformResult } from 'rollup'
import { Transformer } from '../types'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:transform:vue2')

export function Vue2Transformer(ctx: Context): Transformer {
  return (code, id, path, query) => {
    if (!(path.endsWith('.vue') || ctx.options.customLoaderMatcher(id)))
      return null

    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const head: string[] = []
    let no = 0
    const componentPaths: string[] = []

    const s = new MagicString(code)

    for (const match of code.matchAll(/_c\(['"](.+?)["']([,)])/g)) {
      const [full, matchStr, append] = match

      if (match.index != null && matchStr && !matchStr.startsWith('_')) {
        const start = match.index
        const end = start + full.length
        debug(`| ${matchStr}`)
        const name = pascalCase(matchStr)
        componentPaths.push(name)
        const component = ctx.findComponent(name, [sfcPath])
        if (component) {
          const var_name = `__vite_components_${no}`
          head.push(stringifyComponentImport({ ...component, name: var_name }, ctx))
          no += 1
          s.overwrite(start, end, `_c(${var_name}${append}`)
        }
      }
    }

    debug(`^ (${no})`)

    ctx.updateUsageMap(sfcPath, componentPaths)

    s.prepend(`${head.join('\n')}\n`)

    const result: TransformResult = { code: s.toString() }
    if (ctx.viteConfig.build.sourcemap)
      result.map = s.generateMap({ hires: true })
    return result
  }
}
