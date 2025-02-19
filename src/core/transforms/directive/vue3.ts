import type MagicString from 'magic-string'
import type { ResolveResult } from '../../transformer'

export default function resolveVue3(
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
