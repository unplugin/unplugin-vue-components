import type { ComponentInfo, ComponentResolver } from '../../types'

export interface MapvglResolverOptions {

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

function resolveComponent(name: string, options: MapvglResolverOptions): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (!name.match(/^ElBMapv[A-Z]/))
    return

  return {
    importName: name,
    path: 'vue-mapvgl/es',
  }
}

/**
 * Resolver for vue-mapvgl
 *
 * @author @yangyanggu
 * @link https://vue-mapvgl.guyixi.cn/ for vue-mapvgl
 *
 */
export function VueMapvglPlusResolver(
  options: MapvglResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: MapvglResolverOptions

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
