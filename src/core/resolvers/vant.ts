import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase } from '../utils'

const isServer = Boolean(process.env.SSR || process.env.SSG || process.env.VITE_SSR || process.env.VITE_SSG)
const moduleType = isServer ? 'lib' : 'es'

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

  if (!importStyle || isServer)
    return

  if (importStyle === 'less')
    return `vant/${moduleType}/${dirName}/style/less`

  if (importStyle === 'css')
    return `vant/${moduleType}/${dirName}/style/index`

  return `vant/${moduleType}/${dirName}/style/index`
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
          path: `vant/${moduleType}`,
          sideEffects: getSideEffects(kebabCase(partialName), options),
        }
      }
    },
  }
}
