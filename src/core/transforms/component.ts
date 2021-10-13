import Debug from 'debug'
import type { CallExpression } from '@babel/types'
import type MagicString from 'magic-string'
import { pascalCase, stringifyComponentImport } from '../utils'
import type { Context } from '../context'

const debug = Debug('unplugin-vue-components:transform:component')

export default async(nodes: CallExpression[], version: 'vue2' | 'vue3', s: MagicString, ctx: Context, sfcPath: string) => {
  let no = 0

  for (const node of nodes) {
    const { callee, arguments: args } = node
    if (callee.type !== 'Identifier' || callee.name !== (version === 'vue2' ? '_c' : '_resolveComponent') || args[0].type !== 'StringLiteral')
      continue
    const componentName = args[0].value
    if (!componentName || componentName.startsWith('_'))
      continue

    debug(`| ${componentName}`)
    const name = pascalCase(componentName)
    ctx.updateUsageMap(sfcPath, [name])

    const component = await ctx.findComponent(name, 'component', [sfcPath])
    if (component) {
      const var_name = `__unplugin_components_${no}`
      s.prepend(`${stringifyComponentImport({ ...component, name: var_name }, ctx)};\n`)
      no += 1

      const replacedNode = version === 'vue2' ? args[0] : node
      s.overwrite(replacedNode.start!, replacedNode.end!, var_name)
    }
  }

  debug(`^ (${no})`)
}
