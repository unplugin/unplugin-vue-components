import { readFileSync } from 'fs'
import { resolveModule } from 'local-pkg'
import type { ComponentResolver } from '../../types'

let directives: string[] | undefined

/**
 * Resolver for VueUse
 *
 * @link https://github.com/vueuse/vueuse
 */
export function VueUseDirectiveResolver(): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      if (!directives) {
        let indexesJson: any
        try {
          const corePath = resolveModule('@vueuse/core') || process.cwd()
          const path = resolveModule('@vueuse/core/indexes.json')
            || resolveModule('@vueuse/metadata/index.json')
            || resolveModule('@vueuse/metadata/index.json', { paths: [corePath] })
          indexesJson = JSON.parse(readFileSync(path!, 'utf-8'))
          directives = indexesJson
            .functions
            .filter((i: any) => i.directive && i.name)
            .map(({ name }: any) => name[0].toUpperCase() + name.slice(1))
        }
        catch (error) {
          console.error(error)
          throw new Error('[vue-components] failed to load @vueuse/core, have you installed it?')
        }
      }

      if (directives && directives.includes(name))
        return { name: `v${name}`, as: name, from: '@vueuse/components' }
    },
  }
}
