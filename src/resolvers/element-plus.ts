import gt from 'compare-versions'
import { ComponentResolver, SideEffectsInfo } from '../types'
import { getPkgVersion, kebabCase } from '../utils'

export interface ElementPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * specify element-plus version to load style
   *
   * @default installed version
   */
  version?: string
}

/**
 * @deprecated
 * @param partialName
 * @param options
 *
 * @returns
 */
function getSideEffectsLegacy(
  partialName: string,
  options: ElementPlusResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options
  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'element-plus/packages/theme-chalk/src/base.scss',
      `element-plus/packages/theme-chalk/src/${partialName}.scss`,
    ]
  }
  else if (importStyle === true || importStyle === 'css') {
    return [
      'element-plus/lib/theme-chalk/base.css',
      `element-plus/lib/theme-chalk/el-${partialName}.css`,
    ]
  }
}

function getSideEffects(dirName: string, options: ElementPlusResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = 'css' } = options

  if (importStyle === 'sass')
    return `element-plus/es/components/${dirName}/style`

  else if (importStyle === true || importStyle === 'css')
    return `element-plus/es/components/${dirName}/style/css`
}

/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 * See https://github.com/antfu/vite-plugin-components/issues/117 for more details
 *
 * @author @develar @nabaonan
 * @link https://element-plus.org/#/en-US for element-plus
 *
 */
export function ElementPlusResolver(
  options: ElementPlusResolverOptions = {},
): ComponentResolver {
  return (name: string) => {
    if (name.match(/^El[A-Z]/)) {
      const {
        version = getPkgVersion('element-plus', '1.0.2'),
      } = options
      const partialName = kebabCase(name.slice(2))// ElTableColumn->table-column

      // >=1.1.0-beta.1
      if (gt(version, '1.1.0-beta.1')) {
        return {
          importName: name,
          path: 'element-plus/es',
          sideEffects: getSideEffects(partialName, options),
        }
      }
      // >=1.0.2-beta.28
      else if (gt(version, '1.0.2-beta.28')) {
        return {
          path: `element-plus/es/el-${partialName}`,
          sideEffects: getSideEffectsLegacy(partialName, options),
        }
      }
      // for <=1.0.1
      else {
        return {
          path: `element-plus/lib/el-${partialName}`,
          sideEffects: getSideEffectsLegacy(partialName, options),
        }
      }
    }
  }
}
