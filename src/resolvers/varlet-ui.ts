import { ComponentResolver } from '../types'
import { kebabCase } from '../utils'

export interface VarletUIResolverOptions {
  /**
   * import css along with components
   *
   * @default true
   */
  importCss?: boolean
  /**
   * import less along with components
   *
   * @default false
   */
  importLess?: boolean
}

/**
 * Resolver for VarletUI
 *
 * @link https://github.com/haoziqaq/varlet
 */
export const VarletUIResolver = (options: VarletUIResolverOptions = {}): ComponentResolver => (name: string) => {
  const {
    importCss = true,
    importLess,
  } = options
  if (name.startsWith('Var')) {
    const partialName = name.slice(3)
    return {
      importName: partialName,
      path: '@varlet/ui',
      sideEffects: importLess
        ? `@varlet/ui/es/${kebabCase(partialName)}/style/less.js`
        : importCss
          ? `@varlet/ui/es/${kebabCase(partialName)}/style`
          : undefined,
    }
  }
}
