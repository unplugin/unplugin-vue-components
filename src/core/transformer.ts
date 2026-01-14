import type { TransformResult } from 'unplugin'
import type { Transformer } from '../types'
import type { Context } from './context'
import MagicString from 'magic-string'
import { createDebug } from 'obug'
import { DISABLE_COMMENT } from './constants'
import transformComponent from './transforms/component'
import transformDirectives from './transforms/directive'

const debug = createDebug('unplugin-vue-components:transformer')

export interface ResolveResult {
  rawName: string
  replace: (resolved: string) => void
}

export default function transformer(ctx: Context): Transformer {
  return async (code, id, path) => {
    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const s = new MagicString(code)

    await transformComponent(code, s, ctx, sfcPath)
    if (ctx.options.directives)
      await transformDirectives(code, s, ctx, sfcPath)

    s.prepend(DISABLE_COMMENT)

    const result: TransformResult = { code: s.toString() }
    if (ctx.sourcemap)
      result.map = s.generateMap({ source: id, includeContent: true, hires: 'boundary' })
    return result
  }
}
