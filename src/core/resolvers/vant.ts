import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { isSSR, kebabCase, warnOnce } from '../utils'

const moduleType = isSSR ? 'lib' : 'es'

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

  if (!importStyle || isSSR)
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
 *
 * @deprecated use `import { VantResolver } from '@vant/auto-import-resolver'` instead
 */
export function VantResolver(options: VantResolverOptions = {}): ComponentResolver {
  warnOnce('VantResolver is deprecated. Use `import { VantResolver } from \'@vant/auto-import-resolver\'` instead.')

  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Van')) {
        const partialName = name.slice(3)
        return {
          name: partialName,
          from: `vant/${moduleType}`,
          sideEffects: getSideEffects(kebabCase(partialName), options),
        }
      }
    },
  }
}
