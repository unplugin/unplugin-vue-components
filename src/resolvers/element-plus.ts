import { ComponentResolver } from '../types'

export interface ElementPlusResolverOptions {
  /**
   * import style along with components
   *
   * @default true
   */
  importStyle?: boolean
}

/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 *
 * @author @develar
 * @link https://element-plus.org/#/en-US
 */
export function ElementPlusResolver(options: ElementPlusResolverOptions = {}): ComponentResolver {
  return (name: string) => {
    const { importStyle = true } = options

    if (name.startsWith('El')) {
      const partialName = name[2].toLowerCase() + name.substring(3).replace(/[A-Z]/g, l => `-${l.toLowerCase()}`)
      return {
        path: `element-plus/es/el-${partialName}`,
        sideEffects: importStyle ? `element-plus/packages/theme-chalk/src/${partialName}.scss` : undefined,
      }
    }
  }
}
