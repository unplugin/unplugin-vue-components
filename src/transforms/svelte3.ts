import Debug from 'debug'
import MagicString from 'magic-string'
import { Transformer } from '../types'
import { Context } from '../context'
import { pascalCase, stringifyComponentImport } from '../utils'

const debug = Debug('vite-plugin-components:transform:svelte')

export function Svelte3Transformer(ctx: Context): Transformer {
  return (code, id, path, query) => {
    if (!(path.endsWith('.svelte') || ctx.options.customLoaderMatcher(id)))
      return null

    ctx.searchGlob()

    const sfcPath = ctx.normalizePath(path)
    debug(sfcPath)

    const head: string[] = []
    let no = 0
    const componentPaths: string[] = []

    const s = new MagicString(code)

    // https://github.com/sveltejs/svelte/blob/02b49a1bb413be4250f7e4a0e381ccda7efa1a0f/src/compiler/compile/render_dom/wrappers/InlineComponent/index.ts#L429
    for (const match of code.matchAll(/create_component\((.+)\.\$\$\.fragment\);/g)) {
      const matchedName = match[1]
      if (match.index != null && matchedName && !matchedName.startsWith('_')) {
        const instantiationMatch: RegExpMatchArray | null = findInstantiation(matchedName, code)

        if (!instantiationMatch?.index) {
          continue
        }

        const start = instantiationMatch.index
        const end = start + instantiationMatch[0].length

        const matchedCtor = instantiationMatch[1]

        debug(`| ${matchedCtor}`)
        const name = pascalCase(matchedCtor)
        componentPaths.push(name)
        const component = ctx.findComponent(name, [sfcPath])
        if (component) {
          const var_name = `__vite_components_${no}`
          head.push(stringifyComponentImport({ ...component, name: var_name }, ctx))
          no += 1
          s.overwrite(start, end, `${matchedName} = new ${var_name}`)
        }
      }
    }

    debug(`^ (${no})`)

    ctx.updateUsageMap(sfcPath, componentPaths)

    s.prepend(`${head.join('\n')}\n`)

    return {
      code: s.toString(),
      map: s.generateMap(),
    }
  }

  function findInstantiation(name: string, code: string): RegExpMatchArray | null {
    // https://github.com/sveltejs/svelte/blob/02b49a1bb413be4250f7e4a0e381ccda7efa1a0f/src/compiler/compile/render_dom/wrappers/InlineComponent/index.ts#L465
    const regex = new RegExp(`${name} = new (\\w+)`)
    const match = code.match(regex); // Global flag?

    // Not found
    if (!match?.length) {
      debug(`${name} name assignment call not found.`)
    }

    return match;
  }
}
