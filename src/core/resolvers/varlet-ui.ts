import { ComponentResolver, ComponentResolveResult } from '../../types'
import { kebabCase } from '../utils'

export interface VarletUIResolverOptions {
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean

  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean
}

export function getResolved(name: string, options: VarletUIResolverOptions): ComponentResolveResult {
  const {
    importStyle = 'css',
    importCss = true,
    importLess,
  } = options

  const sideEffects = []

  if (importStyle || importCss) {
    if (importStyle === 'less' || importLess)
      sideEffects.push(`@varlet/ui/es/${kebabCase(name)}/style/less.js`)
    else
      sideEffects.push(`@varlet/ui/es/${kebabCase(name)}/style`)
  }

  return {
    path: '@varlet/ui',
    importName: `_${name}Component`,
    sideEffects,
  }
}

/**
 * Resolver for VarletUI
 *
 * @link https://github.com/haoziqaq/varlet
 */
export function VarletUIResolver(options: VarletUIResolverOptions = {}): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        if (name.startsWith('Var')) return getResolved(name.slice(3), options)
      },
    },
    {
      type: 'directive',
      resolve: (name: string) => {
        const { directives = true } = options

        if (!directives) return

        return getResolved(name, options)
      },
    },
  ]
}
