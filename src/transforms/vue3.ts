import Debug from 'debug'
import { Transformer } from '../types'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:transform:vue3')

export function Vue3Transformer(ctx: Context): Transformer {
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
          if (ctx.options.importPathTransform) {
            const result = ctx.options.importPathTransform(component.path)
            if (result != null)
              component.path = result
          }

          if (component.importName)
            head.push(`import { ${component.importName} as ${var_name} } from '${component.path}'`)
          else
            head.push(`import ${var_name} from '${component.path}'`)

          if (component.stylePath)
            head.push(`import '${component.stylePath}'`)

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
