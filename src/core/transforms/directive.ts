import type MagicString from 'magic-string'
import type { Context } from '../context'
import type { ResolveResult } from '../transformer'
import { createDebug } from 'obug'
import { DIRECTIVE_IMPORT_PREFIX } from '../constants'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = createDebug('unplugin-vue-components:transform:directive')

export default async function transformDirective(code: string, s: MagicString, ctx: Context, sfcPath: string) {
  let no = 0

  const results = resolveVue3(code, s, ctx.options.transformerUserResolveFunctions)
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

function resolveVue3(
  code: string,
  s: MagicString,
  transformerUserResolveFunctions?: boolean,
): ResolveResult[] {
  const results: ResolveResult[] = []

  for (const match of code.matchAll(/_?resolveDirective\("(.+?)"\)/g)) {
    const matchedName = match[1]
    if (!transformerUserResolveFunctions && !match[0].startsWith('_')) {
      continue
    }
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
