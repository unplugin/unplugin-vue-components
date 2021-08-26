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
   * import style before 1.1
   * @default false
   */
  lagency?: boolean
}

function getLagencySideEffects(

  dirName: string,
  options: ElementPlusResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options
  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'element-plus/packages/theme-chalk/src/base.scss',
      `element-plus/packages/theme-chalk/src/${dirName}.scss`,
    ]
  }
  else {
    return [
      'element-plus/lib/theme-chalk/base.css',
      `element-plus/lib/theme-chalk/${dirName}.css`,
    ]
  }
}

function getSideEffects(dirName: string, options: ElementPlusResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = 'css', lagency = false } = options

  if (importStyle === 'sass')
    return `element-plus/es/components/${dirName}/style`

  else if (importStyle === true || importStyle === 'css')
    return `element-plus/es/components/${dirName}/style/css`
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
export function ElementPlusResolver(
  dirName: string,
  options: ElementPlusResolverOptions = {},
): ComponentResolver {
  return (name: string) => {
    const { lagency = false } = options

    if (name.match(/^El[A-Z]/)) {
      let sideEffects
      if (lagency) {
        const dirName = kebabCase(name)
        sideEffects = getLagencySideEffects(dirName, options)
      }
      else {
        const dirName = kebabCase(name.slice(2))
        sideEffects = getSideEffects(dirName, options)
      }

      return {
        importName: name,
        path: 'element-plus/es',
        sideEffects,
      }
    }
  }
}
