import type { ComponentInfo, ComponentResolver } from '../../types'

export interface MapResolverOptions {

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

function resolveComponent(name: string, options: MapResolverOptions): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (!name.match(/^ElAmap[A-Z]*/))
    return

  return {
    importName: name,
    path: '@vuemap/vue-amap/es',
  }
}

/**
 * Resolver for @vuemap/vue-amap
 *
 * @author @yangyanggu
 * @link https://vue-amap.guyixi.cn/ for @vuemap/vue-amap
 *
 */
export function VueAmapPlusResolver(
  options: MapResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: MapResolverOptions

  async function resolveOptions() {
    if (optionsResolved)
      return optionsResolved
    optionsResolved = {
      exclude: undefined,
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: async(name: string) => {
        return resolveComponent(name, await resolveOptions())
      },
    },
  ]
}
