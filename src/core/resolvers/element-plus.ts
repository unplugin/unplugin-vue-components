import cv from 'compare-versions'
import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from '../../types'
import { getPkgVersion, kebabCase } from '../utils'

export interface ElementPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean

  /**
   * specify element-plus version to load style
   *
   * @default installed version
   */
  version?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

type ElementPlusResolverOptionsResolved = Required<Omit<ElementPlusResolverOptions, 'exclude'>> &
Pick<ElementPlusResolverOptions, 'exclude'>

/**
 * @deprecated
 * @param partialName
 * @param options
 *
 * @returns
 */
function getSideEffectsLegacy(
  partialName: string,
  options: ElementPlusResolverOptionsResolved,
): SideEffectsInfo | undefined {
  const { importStyle } = options
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

function getSideEffects(dirName: string, options: ElementPlusResolverOptionsResolved): SideEffectsInfo | undefined {
  const { importStyle, ssr } = options
  const themeFolder = 'element-plus/theme-chalk'
  const esComponentsFolder = 'element-plus/es/components'

  if (importStyle === 'sass')
    return ssr ? `${themeFolder}/src/${dirName}.scss` : `${esComponentsFolder}/${dirName}/style/index`
  else if (importStyle === true || importStyle === 'css')
    return ssr ? `${themeFolder}/el-${dirName}.css` : `${esComponentsFolder}/${dirName}/style/css`
}

function resolveComponent(name: string, options: ElementPlusResolverOptionsResolved): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (!name.match(/^El[A-Z]/))
    return

  const partialName = kebabCase(name.slice(2))// ElTableColumn -> table-column
  const { version, ssr } = options

  // >=1.1.0-beta.1
  if (cv.compare(version, '1.1.0-beta.1', '>=')) {
    return {
      importName: name,
      path: `element-plus/${ssr ? 'lib' : 'es'}`,
      sideEffects: getSideEffects(partialName, options),
    }
  }
  // >=1.0.2-beta.28
  else if (cv.compare(version, '1.0.2-beta.28', '>=')) {
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

function resolveDirective(name: string, options: ElementPlusResolverOptionsResolved): ComponentInfo | undefined {
  if (!options.directives) return

  const directives: Record<string, { importName: string; styleName: string }> = {
    Loading: { importName: 'ElLoadingDirective', styleName: 'loading' },
    Popover: { importName: 'ElPopoverDirective', styleName: 'popover' },
    InfiniteScroll: { importName: 'ElInfiniteScroll', styleName: 'infinite-scroll' },
  }

  const directive = directives[name]
  if (!directive) return

  const { version, ssr } = options

  // >=1.1.0-beta.1
  if (cv.compare(version, '1.1.0-beta.1', '>=')) {
    return {
      importName: directive.importName,
      path: `element-plus/${ssr ? 'lib' : 'es'}`,
      sideEffects: getSideEffects(directive.styleName, options),
    }
  }
}

/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 * See https://github.com/antfu/vite-plugin-components/issues/117 for more details
 *
 * @author @develar @nabaonan @sxzz
 * @link https://element-plus.org/ for element-plus
 *
 */
export function ElementPlusResolver(
  options: ElementPlusResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: ElementPlusResolverOptionsResolved

  async function resolveOptions() {
    if (optionsResolved)
      return optionsResolved
    optionsResolved = {
      ssr: false,
      version: await getPkgVersion('element-plus', '1.1.0-beta.21'),
      importStyle: 'css',
      directives: true,
      exclude: undefined,
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: async(name: string) => {
        return resolveComponent(name, await resolveOptions())
      },
    },
    {
      type: 'directive',
      resolve: async(name: string) => {
        return resolveDirective(name, await resolveOptions())
      },
    },
  ]
}
