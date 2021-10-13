import Debug from 'debug'
import type MagicString from 'magic-string'
import { pascalCase, stringifyComponentImport } from '../../utils'
import type { Context } from '../../context'
import { SupportedTransformer } from '../../..'

const debug = Debug('unplugin-vue-components:transform:directive')

export default async(code: string, transformer: SupportedTransformer, s: MagicString, ctx: Context, sfcPath: string) => {
  let no = 0

  const { resolve } = await (transformer === 'vue2' ? import('./vue2') : import('./vue3'))

  const results = resolve(code, s)
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
