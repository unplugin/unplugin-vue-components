import Debug from 'debug'
import { Context } from '../context'
import { RESOLVER_EXT } from '../constants'

const debug = Debug('vite-plugin-components:resolver')

export function isResolverPath(reqPath: string) {
  return reqPath.endsWith(RESOLVER_EXT)
}

export async function generateResolver(ctx: Context, reqPath: string) {
  const sfcPath = ctx.normalizePath(reqPath.slice(0, -RESOLVER_EXT.length))
  debug(sfcPath)

  const names = await ctx.getImports(sfcPath) || []
  const components = ctx.findComponents(names, [sfcPath])

  debug('using', names, 'imported', components.map(i => i.name))

  return `
    ${components.map(({ name, path }) => `import ${name} from "${path}"`).join('\n')}

    export default (components) => { 
      return Object.assign({}, { ${components.map(i => i.name).join(', ')} }, components) 
    }
  `
}
