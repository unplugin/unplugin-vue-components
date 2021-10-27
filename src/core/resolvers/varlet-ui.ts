import { ComponentResolver } from '../../types'
import { kebabCase } from '../utils'

export interface VarletUIResolverOptions {
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean
  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean
}

/**
 * Resolver for VarletUI
 *
 * @link https://github.com/haoziqaq/varlet
 */
export function VarletUIResolver(options: VarletUIResolverOptions = {}): ComponentResolver {
  return (name: string) => {
    const {
      importStyle = 'css',
      importCss = true,
      importLess,
    } = options

    if (name.startsWith('Var')) {
      const partialName = name.slice(3)
      const sideEffects = []

      if (importStyle || importCss) {
        if (importStyle === 'less' || importLess)
          sideEffects.push(`@varlet/ui/es/${kebabCase(partialName)}/style/less.js`)
        else
          sideEffects.push(`@varlet/ui/es/${kebabCase(partialName)}/style`)
      }

      return {
        importName: `_${partialName}Component`,
        path: '@varlet/ui',
        sideEffects,
      }
    }
  }
}
