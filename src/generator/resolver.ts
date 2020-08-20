import Debug from 'debug'
import { Context } from '../types'
import { RESOLVER_EXT } from '../constants'

const debug = Debug('vite-plugin-components:resolver')

export function isResolverPath(reqPath: string) {
  return reqPath.endsWith(RESOLVER_EXT)
}

export function generateResolver(ctx: Context, reqPath: string) {
  const sfcPath = reqPath.slice(0, -RESOLVER_EXT.length)
  const names = ctx.importMap[sfcPath] || []
  const components = ctx.components.filter(i => names.includes(i[0]) && i[1] !== sfcPath)

  debug(`resolving ${sfcPath}`)
  debug(`components [${names.join(', ')}]`)

  return `
    ${components.map(([name, path]) => `import ${name} from "${path}"`).join('\n')}

    export default (components) => { 
      return Object.assign({}, { ${components.map(i => i[0]).join(', ')} }, components) 
    }
  `
}
