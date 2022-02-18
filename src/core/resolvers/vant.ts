import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase } from '../utils'

export interface VantResolverOptions {
  /**
   * import style css or less along with components
   *
   * @default true
   */
  importStyle?: boolean | 'css' | 'less'
}

function getSideEffects(dirName: string, options: VantResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = true } = options

  if (!importStyle)
    return

  if (importStyle === 'less')
    return `vant/es/${dirName}/style/less`

  if (importStyle === 'css')
    return `vant/es/${dirName}/style/index`

  return `vant/es/${dirName}/style/index`
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
      if (name.startsWith('Van')) {
        const partialName = name.slice(3)
        return {
          importName: partialName,
          path: 'vant/es',
          sideEffects: getSideEffects(kebabCase(partialName), options),
        }
      }
    },
  }
}
