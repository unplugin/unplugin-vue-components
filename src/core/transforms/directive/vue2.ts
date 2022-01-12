import type {
  BlockStatement, CallExpression, File, FunctionExpression, ObjectProperty, VariableDeclaration,
} from '@babel/types'
import type MagicString from 'magic-string'
import type { ParseResult } from '@babel/parser'
import { importModule, isPackageExists } from 'local-pkg'
import type { ResolveResult } from '../../transformer'

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

export default async function resolveVue2(code: string, s: MagicString): Promise<ResolveResult[]> {
  if (!isPackageExists('@babel/parser') || !isPackageExists('@babel/traverse'))
    throw new Error('[unplugin-vue-components:directive] To use Vue 2 directive you will need to install Babel first: "npm install -D @babel/parser @babel/traverse"')

  const { parse } = await importModule('@babel/parser') as typeof import('@babel/parser')
  const ast = parse(code, {
    sourceType: 'module',
  })
  const nodes: CallExpression[] = []
  const { default: traverse } = await importModule('@babel/traverse') as typeof import('@babel/traverse')
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
