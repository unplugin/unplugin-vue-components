import type { ComponentResolver } from '../../types'

export interface NutUIResolverOptions {
  /**
   * NutUI or NutUI-Taro
   *
   * @default false
   */
  taro?: boolean
}

/**
 * Resolver for NutUI 4.0+
 *
 * @link https://github.com/jdf2e/nutui
 */
export function NutUIResolver(options: NutUIResolverOptions = {}): ComponentResolver {
  const { taro = false } = options
  const packageName = taro ? '@nutui/nutui-taro' : '@nutui/nutui'
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('Nut')) {
        const partialName = name.slice(3)
        return {
          name: partialName,
          from: packageName,
          sideEffects: `${packageName}/dist/packages/${partialName.toLowerCase()}/style`,
        }
      }
    },
  }
}
