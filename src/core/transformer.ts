import Debug from 'debug'
import MagicString from 'magic-string'
import { TransformResult } from 'unplugin'
import { CallExpression } from '@babel/types'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import type { Transformer } from '../types'
import { DISABLE_COMMENT } from './constants'
import { Context } from './context'
import transformComponent from './transforms/component'
import transformDirectives from './transforms/directive'

const debug = Debug('unplugin-vue-components:transformer')

export default (ctx: Context, version: 'vue2'|'vue3'): Transformer => {
  return async(code, id, path) => {
    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const s = new MagicString(code)
    const ast = parse(code, {
      sourceType: 'module',
    })
    const nodes: CallExpression[] = []
    traverse(ast, {
      CallExpression(path) {
        nodes.push(path.node)
      },
    })

    await transformComponent(nodes, version, s, ctx, sfcPath)
    await transformDirectives(nodes, version, s, ctx, sfcPath, ast)

    s.prepend(DISABLE_COMMENT)

    const result: TransformResult = { code: s.toString() }
    if (ctx.sourcemap)
      result.map = s.generateMap({ source: id, includeContent: true })
    return result
  }
}
