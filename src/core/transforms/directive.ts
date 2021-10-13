import Debug from 'debug'
import type {
  CallExpression, ObjectProperty, File, VariableDeclaration, FunctionExpression, BlockStatement,
} from '@babel/types'
import type MagicString from 'magic-string'
import { ParseResult } from '@babel/parser'
import { pascalCase, stringifyComponentImport } from '../utils'
import type { Context } from '../context'

const debug = Debug('unplugin-vue-components:transform:directive')

interface ResolveResult {
  rawName: string
  replace: (resolved: string) => void
}

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

const resolveVue2 = async(node: CallExpression, s: MagicString, ast: ParseResult<File>): Promise<ResolveResult[]> => {
  const { callee, arguments: args } = node
  if (callee.type !== 'Identifier' || callee.name !== '_c' || args[1].type !== 'ObjectExpression')
    return []

  const directives = args[1].properties.find(
    (property): property is ObjectProperty =>
      property.type === 'ObjectProperty'
      && property.key.type === 'Identifier'
      && property.key.name === 'directives',
  )?.value
  if (!directives || directives.type !== 'ArrayExpression')
    return []

  const renderStart = getRenderFnStart(ast)

  const results: ResolveResult[] = []
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

  return results
}

const resolveVue3 = async(node: CallExpression, s: MagicString): Promise<ResolveResult[]> => {
  const { callee, arguments: args } = node
  if (
    callee.type !== 'Identifier'
    || callee.name !== '_resolveDirective'
    || args[0].type !== 'StringLiteral'
  )
    return []

  const rawName = args[0].value
  if (!rawName || rawName.startsWith('_')) return []

  return [{
    rawName,
    replace: resolved => s.overwrite(node.start!, node.end!, resolved),
  }]
}

export default async(nodes: CallExpression[], version: 'vue2' | 'vue3', s: MagicString, ctx: Context, sfcPath: string, ast: ParseResult<File>) => {
  let no = 0

  for (const node of nodes) {
    const results = version === 'vue2' ? await resolveVue2(node, s, ast) : await resolveVue3(node, s)
    if (results.length === 0) continue

    for (const result of results) {
      debug(`| ${result.rawName}`)

      const name = pascalCase(result.rawName)
      ctx.updateUsageMap(sfcPath, [name])
      const directive = await ctx.findComponent(name, 'directive', [sfcPath])

      if (!directive) continue

      const varName = `__unplugin_directives_${no}`
      s.prepend(`${stringifyComponentImport({ ...directive, name: varName }, ctx)};\n`)
      no += 1
      result.replace(varName)
    }
  }

  debug(`^ (${no})`)
}
