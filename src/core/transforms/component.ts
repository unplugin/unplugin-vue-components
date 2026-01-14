import type MagicString from 'magic-string'
import type { SupportedTransformer } from '../..'
import type { Context } from '../context'
import type { ResolveResult } from '../transformer'
import { createDebug } from 'obug'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = createDebug('unplugin-vue-components:transform:component')

function resolveVue2(code: string, s: MagicString) {
  const results: ResolveResult[] = []
  for (const match of code.matchAll(/\b(_c|h)\(\s*['"](.+?)["']([,)])/g)) {
    const [full, renderFunctionName, matchedName, append] = match
    if (match.index != null && matchedName && !matchedName.startsWith('_')) {
      const start = match.index
      const end = start + full.length
      results.push({
        rawName: matchedName,
        replace: resolved => s.overwrite(start, end, `${renderFunctionName}(${resolved}${append}`),
      })
    }
  }

  return results
}

function resolveVue3(
  code: string,
  s: MagicString,
  transformerUserResolveFunctions: boolean,
) {
  const results: ResolveResult[] = []

  /**
   * when using some plugin like plugin-vue-jsx, resolveComponent will be imported as resolveComponent1 to avoid duplicate import
   */
  for (const match of code.matchAll(/_?resolveComponent\d*\("(.+?)"\)/g)) {
    if (!transformerUserResolveFunctions && !match[0].startsWith('_')) {
      continue
    }
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

export default async function transformComponent(code: string, transformer: SupportedTransformer, s: MagicString, ctx: Context, sfcPath: string) {
  let no = 0

  const results = transformer === 'vue2'
    ? resolveVue2(code, s)
    : resolveVue3(code, s, ctx.options.transformerUserResolveFunctions)

  for (const { rawName, replace } of results) {
    debug(`| ${rawName}`)
    const name = pascalCase(rawName)
    ctx.updateUsageMap(sfcPath, [name])
    const component = await ctx.findComponent(name, 'component', [sfcPath])
    if (component) {
      const varName = `__unplugin_components_${no}`
      s.prepend(`${stringifyComponentImport({ ...component, as: varName }, ctx)};\n`)
      no += 1
      replace(varName)
    }
  }

  debug(`^ (${no})`)
}
