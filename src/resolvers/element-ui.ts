import {
  ComponentResolver,
  SideEffectsInfo,
} from '../types'
import { kebabCase } from '../utils'

export interface ElementUiResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'
}

function getSideEffects(
  partialName: string,
  options: ElementUiResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options

  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'element-ui/packages/theme-chalk/src/base.scss',
      `element-ui/packages/theme-chalk/src/${partialName}.scss`,
    ]
  }
  else {
    return [
      'element-ui/lib/theme-chalk/base.css',
      `element-ui/lib/theme-chalk/${partialName}.css`,
    ]
  }
}

/**
 * Resolver for Element-UI
 * @link https://element.eleme.cn/#/zh-CN
 * @version @element-ui ^2.15.3, @vue ^2.6.14
 * @author @nabaonan
 */
export const ElementUiResolver = (options: ElementUiResolverOptions = {}): ComponentResolver =>
  (name: string) => {
    if (name.startsWith('El')) {
      const compName = name.slice(2)
      const partialName = kebabCase(compName)
      return {
        path: `element-ui/lib/${partialName}`,
        sideEffects: getSideEffects(partialName, options),
      }
    }
  }
