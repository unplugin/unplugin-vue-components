import Debug from 'debug'
import type {
  CallExpression, ObjectProperty, File, VariableDeclaration, FunctionExpression, BlockStatement,
} from '@babel/types'
import type MagicString from 'magic-string'
import { parse, ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { pascalCase, stringifyComponentImport } from '../utils'
import type { Context } from '../context'
import { ResolveResult } from '../transformer'
import { VueVersion } from '../..'

const debug = Debug('unplugin-vue-components:transform:directive')

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

const resolveVue2 = (code: string, s: MagicString): ResolveResult[] => {
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

const resolveVue3 = (code: string, s: MagicString): ResolveResult[] => {
  const results: ResolveResult[] = []

  for (const match of code.matchAll(/_resolveDirective\("(.+?)"\)/g)) {
    const matchedName = match[1]
    if (match.index != null && matchedName && !matchedName.startsWith('_')) {
      const start = match.index
      const end = start + match[0].length
      results.push({
        rawName: matchedName,
        replace: resolved => s.overwrite(start, end, resolved),
      })
    }
  }

  return results
}

export default async(code: string, version: VueVersion, s: MagicString, ctx: Context, sfcPath: string) => {
  let no = 0

  const results = version === 'vue2' ? resolveVue2(code, s) : resolveVue3(code, s)
  for (const { rawName, replace } of results) {
    debug(`| ${rawName}`)
    const name = pascalCase(rawName)
    ctx.updateUsageMap(sfcPath, [name])

    const directive = await ctx.findComponent(name, 'directive', [sfcPath])
    if (!directive) continue

    const varName = `__unplugin_directives_${no}`
    s.prepend(`${stringifyComponentImport({ ...directive, name: varName }, ctx)};\n`)
    no += 1
    replace(varName)
  }

  debug(`^ (${no})`)
}
