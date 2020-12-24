import Debug from 'debug'
import type { Transform } from 'vite'
import { Context } from '../context'

const debug = Debug('vite-plugin-components:transform:template')

/**
 * This transformer does not actually change the code,
 * If search for the components a vue file imported and
 * save them inside `ctx` for resolver to work
 *
 * @param ctx
 */
export function VueTemplateTransformer(ctx: Context): Transform {
  return {
    test({ path, query }) {
      return !path.startsWith('/@')
        && path.endsWith('.vue')
        && query.type === 'template'
    },
    transform({ code, path }) {
      const filepath = ctx.normalizePath(path)
      const imports = Array.from(code.matchAll(/_resolveComponent\("(.*)"\)/g)).map(i => i[1])
      ctx.setImports(filepath, imports)
      debug(filepath, imports)
      return code
    },
  }
}
