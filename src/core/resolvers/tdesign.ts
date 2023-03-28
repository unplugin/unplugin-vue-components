import type { ComponentResolver } from '../../types'

export interface TDesignResolverOptions {
  /**
   * select the specified library
   * @default 'vue'
   */
  library?: 'vue' | 'vue-next' | 'react' | 'mobile-vue' | 'mobile-react'

  /**
   * resolve `tdesign-icons'
   * @default false
   */
  resolveIcons?: boolean

  /**
   * whether to import ESM version
   * @default false
   */
  esm?: boolean

  /**
   * exclude component name, if match do not resolve the name
   *
   */
  exclude?: string | RegExp | (string | RegExp)[]
}

export function TDesignResolver(options: TDesignResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { library = 'vue', exclude } = options
      const importFrom = options.esm ? '/esm' : ''

      if (options.exclude && isExclude(name, exclude))
        return

      if (options.resolveIcons && name.match(/[a-z]Icon$/)) {
        return {
          name,
          from: `tdesign-icons-${library}${importFrom}`,
        }
      }

      if (name.match(/^T[A-Z]/)) {
        const importName = name.slice(1)

        return {
          name: importName,
          from: `tdesign-${library}${importFrom}`,
        }
      }
    },
  }
}

function isExclude(name: string, exclude: string | RegExp | (string | RegExp)[] | undefined): boolean {
  if (typeof exclude === 'string')
    return name === exclude

  if (exclude instanceof RegExp)
    return !!name.match(exclude)

  if (Array.isArray(exclude)) {
    for (const item of exclude) {
      if (name === item || name.match(item))
        return true
    }
  }
  return false
}
