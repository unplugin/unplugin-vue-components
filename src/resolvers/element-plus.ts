import { ComponentResolver, SideEffectsInfo } from '../types'
import { kebabCase } from '../utils'

export interface ElementPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'
  /**
   * use ElementUI in vue2
   *
   * @default false
   */
  useElementUI?: boolean
}

function getSideEffects(
  packageName: string,
  componentName: string,
  options: ElementPlusResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options
  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      `${packageName}/packages/theme-chalk/src/base.scss`,
      `${packageName}/packages/theme-chalk/src/${componentName}.scss`,
    ]
  }
  else {
    return [
      `${packageName}/lib/theme-chalk/base.css`,
      `${packageName}/lib/theme-chalk/${componentName}.css`,
    ]
  }
}
/**
 * Resolver for Element Plus or Element UI
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 *
 * @author @develar @nabaonan
 * @link https://element-plus.org/#/en-US for element-plus
 * @link https://element.eleme.cn/#/zh-CN for element-ui
 */
export function ElementPlusResolver(options: ElementPlusResolverOptions = {}): ComponentResolver {
  return (name: string) => {
    if (name.match(/^El[A-Z]/)) {
      const { useElementUI = false } = options
      const packageName = useElementUI ? 'element-ui' : 'element-plus'
      const componentName = useElementUI ? kebabCase(name.slice(2)) : kebabCase(name)
      return {
        path: `${packageName}/lib/${componentName}`,
        sideEffects: getSideEffects(packageName, componentName, options),
      }
    }
  }
}
