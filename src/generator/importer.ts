import Debug from 'debug'
import { Context } from '../context'
import { RESOLVER_EXT } from '../constants'
import { stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:importer')

function timeoutError(reqPath: string, timeout = 10000) {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout on resolving ${reqPath}`))
    }, timeout)
  })
}

export function isResolverPath(reqPath: string) {
  return reqPath.endsWith(RESOLVER_EXT)
}

export async function generateResolver(ctx: Context, reqPath: string) {
  const sfcPath = ctx.normalizePath(reqPath.slice(0, -RESOLVER_EXT.length))
  debug(sfcPath)

  const names: string[] = await Promise.race([
    ctx.getImports(sfcPath),
    timeoutError(reqPath),
  ]) || []

  if (!names?.length)
    return 'export default c => c'

  const components = ctx.findComponents(names, [sfcPath])

  debug('using', names, 'imported', components.map(i => i.name))

  return `
    ${components.map(stringifyComponentImport).join('\n')}

    export default (components) => { 
      return Object.assign({}, { ${components.map(i => i.name).join(', ')} }, components) 
    }
  `
}
