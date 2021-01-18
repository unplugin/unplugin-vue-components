import Debug from 'debug'
import { Transformer } from '../types'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:transform')

export function VueTransformer(ctx: Context): Transformer {
  return (code, id, path, query) => {
    if (!(path.endsWith('.vue') || ctx.options.customLoaderMatcher(id)))
      return code

    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const head: string[] = []
    let no = 0
    const componentPaths: string[] = []

    let transformed = code.replace(/_resolveComponent\("(.+?)"\)/g, (str, match) => {
      if (match && !match.startsWith('_')) {
        debug(`| ${match}`)
        const name = pascalCase(match)
        componentPaths.push(name)
        const component = ctx.findComponent(name, [sfcPath])
        if (component) {
          const var_name = `__vite_components_${no}`
          head.push(stringifyComponentImport({ ...component, name: var_name }))
          no += 1
          return var_name
        }
      }
      return str
    })

    debug(`^ (${no})`)

    ctx.updateUsageMap(sfcPath, componentPaths)

    transformed = `${head.join('\n')}\n${transformed}`

    return transformed
  }
}
