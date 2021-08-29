import { ComponentResolver } from '../../types'

let components: string[] | undefined

/**
 * Resolver for VueUse
 *
 * @link https://github.com/vueuse/vueuse
 */
export function VueUseComponentsResolver(): ComponentResolver {
  return (name: string) => {
    if (!components) {
      try {
        /* eslint-disable @typescript-eslint/no-var-requires */
        const indexesJson = require('@vueuse/core/indexes.json')
        components = indexesJson
          .functions
          .filter((i: any) => i.component && i.name)
          .map(({ name }: any) => name[0].toUpperCase() + name.slice(1))
      }
      catch (error) {
        components = []
      }
    }

    if (components && components.includes(name))
      return { importName: name, path: '@vueuse/components' }
  }
}
