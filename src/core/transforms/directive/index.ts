import type MagicString from 'magic-string'
import type { SupportedTransformer } from '../../..'
import type { Context } from '../../context'
import { createDebug } from 'obug'
import { DIRECTIVE_IMPORT_PREFIX } from '../../constants'
import { pascalCase, stringifyComponentImport } from '../../utils'
import vue2Resolver from './vue2'
import vue3Resolver from './vue3'

const debug = createDebug('unplugin-vue-components:transform:directive')

export default async function transformDirective(code: string, transformer: SupportedTransformer, s: MagicString, ctx: Context, sfcPath: string) {
  let no = 0

  const results = await (transformer === 'vue2' ? vue2Resolver(code, s) : vue3Resolver(code, s))
  for (const { rawName, replace } of results) {
    debug(`| ${rawName}`)
    const name = `${DIRECTIVE_IMPORT_PREFIX}${pascalCase(rawName)}`
    ctx.updateUsageMap(sfcPath, [name])

    const directive = await ctx.findComponent(name, 'directive', [sfcPath])
    if (!directive)
      continue

    const varName = `__unplugin_directives_${no}`
    s.prepend(`${stringifyComponentImport({ ...directive, as: varName }, ctx)};\n`)
    no += 1
    replace(varName)
  }

  debug(`^ (${no})`)
}
