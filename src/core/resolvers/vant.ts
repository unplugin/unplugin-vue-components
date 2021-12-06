import { ComponentResolver } from '../../types'
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
export function VantResolver(options: VantResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { importStyle = true } = options

      if (name.startsWith('Van')) {
        const partialName = name.slice(3)
        return {
          importName: partialName,
          path: 'vant/es',
          sideEffects: importStyle ? `vant/es/${kebabCase(partialName)}/style/index` : undefined,
        }
      }
    },
  }
}
