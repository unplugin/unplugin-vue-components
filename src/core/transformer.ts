import Debug from 'debug'
import MagicString from 'magic-string'
import type { TransformResult } from 'unplugin'
import type { SupportedTransformer } from '..'
import type { Transformer } from '../types'
import { DISABLE_COMMENT } from './constants'
import type { Context } from './context'
import transformComponent from './transforms/component'
import transformDirectives from './transforms/directive'

const debug = Debug('unplugin-vue-components:transformer')

export interface ResolveResult {
  rawName: string
  replace: (resolved: string) => void
}

export default function transformer(ctx: Context, transformer: SupportedTransformer): Transformer {
  return async (code, id, path) => {
    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const s = new MagicString(code)

    await transformComponent(code, transformer, s, ctx, sfcPath)
    if (ctx.options.directives)
      await transformDirectives(code, transformer, s, ctx, sfcPath)

    s.prepend(DISABLE_COMMENT)

    const result: TransformResult = { code: s.toString() }
    if (ctx.sourcemap)
      result.map = s.generateMap({ source: id, includeContent: true })
    return result
  }
}
