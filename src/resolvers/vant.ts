import { ComponentResolver } from '../types'
import { kebabCase } from '../utils'

export interface VantResolverOptions {
  /**
   * import style along with components
   *
   * @default true
   */
  importStyle?: boolean
}

/**
 * Resolver for Vant
 *
 * @link https://github.com/youzan/vant
 */
export const VantResolver = (options: VantResolverOptions = {}): ComponentResolver => (name: string) => {
  const { importStyle = true } = options
  if (name.startsWith('Van')) {
    const partialName = name.slice(3)
    return {
      importName: partialName,
      path: 'vant/es',
      sideEffects: importStyle ? `vant/es/${kebabCase(partialName)}/style` : undefined,
    }
  }
}
