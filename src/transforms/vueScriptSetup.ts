import Debug from 'debug'
import { Transformer } from '../types'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:transform:script-setup')

export function VueScriptSetupTransformer(ctx: Context): Transformer {
  return (code, id, path, query) => {
    if (!path.endsWith('.vue'))
      return code

    const isBuild = ctx.viteConfig?.isProduction
    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const head: string[] = []
    let no = 0

    let transformed = code.replace(/_resolveComponent\("(.+?)"\)/g, (str, match) => {
      if (match) {
        debug(`name: ${match}`)
        const component = ctx.findComponent(pascalCase(match), [sfcPath])
        if (component) {
          const var_name = `__vite_component_${no}`
          head.push(stringifyComponentImport({ ...component, name: var_name }))
          no += 1
          return var_name
        }
      }
      return str
    })

    transformed = `${head.join('\n')}\n${transformed}`

    // debug(transformed)

    if (isBuild)
      ctx.setImports(sfcPath, [])

    return transformed
  }
}
