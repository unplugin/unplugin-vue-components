import type { ComponentInfo, ComponentResolver } from '../../types'

export interface BmapResolverOptions {

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

function resolveComponent(name: string, options: BmapResolverOptions): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (name !== 'ElBmap' && !name.match(/^ElBmap[A-Z]/))
    return

  return {
    importName: name,
    path: 'vue-bmap-gl/es',
  }
}

/**
 * Resolver for vue-bmap-gl
 *
 * @author @yangyanggu
 * @link https://vue-bmap-gl.guyixi.cn/ for vue-bmap-gl
 *
 */
export function VueBmapGlResolver(
  options: BmapResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: BmapResolverOptions

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
