import type {
  CallExpression, ObjectProperty, File, VariableDeclaration, FunctionExpression, BlockStatement,
} from '@babel/types'
import type MagicString from 'magic-string'
import { parse, ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { ResolveResult } from '../../transformer'

/**
 * get Vue 2 render function position
 * @param ast
 * @returns
 */
const getRenderFnStart = (ast: ParseResult<File>): number => {
  const renderFn = ast.program.body.find((node): node is VariableDeclaration =>
    node.type === 'VariableDeclaration'
      && node.declarations[0].id.type === 'Identifier'
      && node.declarations[0].id.name === 'render',
  )
  const start = (((renderFn?.declarations[0].init as FunctionExpression).body) as BlockStatement).start
  if (start === null)
    throw new Error('[unplugin-vue-components:directive] Cannot find render function position.')
  return start + 1
}

export const resolve = (code: string, s: MagicString): ResolveResult[] => {
  const ast = parse(code, {
    sourceType: 'module',
  })
  const nodes: CallExpression[] = []
  traverse(ast, {
    CallExpression(path) {
      nodes.push(path.node)
    },
  })

  const results: ResolveResult[] = []
  for (const node of nodes) {
    const { callee, arguments: args } = node
    // _c(_, {})
    if (callee.type !== 'Identifier' || callee.name !== '_c' || args[1].type !== 'ObjectExpression')
      continue

    // { directives: [] }
    const directives = args[1].properties.find(
      (property): property is ObjectProperty =>
        property.type === 'ObjectProperty'
          && property.key.type === 'Identifier'
          && property.key.name === 'directives',
    )?.value
    if (!directives || directives.type !== 'ArrayExpression')
      continue

    const renderStart = getRenderFnStart(ast)

    for (const directive of directives.elements) {
      if (directive?.type !== 'ObjectExpression') continue

      const nameNode = directive.properties.find(
        (p): p is ObjectProperty =>
          p.type === 'ObjectProperty'
            && p.key.type === 'Identifier'
            && p.key.name === 'name',
      )?.value
      if (nameNode?.type !== 'StringLiteral') continue
      const name = nameNode.value
      if (!name || name.startsWith('_')) continue
      results.push({
        rawName: name,
        replace: (resolved) => {
          s.prependLeft(renderStart!, `\nthis.$options.directives["${name}"] = ${resolved};`)
        },
      })
    }
  }

  return results
}
