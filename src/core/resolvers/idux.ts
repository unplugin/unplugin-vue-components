import { resolveModule } from 'local-pkg'
import { compare } from 'compare-versions'
import type { ComponentResolver } from '../../types'
import { getPkgVersion, kebabCase } from '../utils'

const specialComponents: Record<string, string> = {
  CdkVirtualScroll: 'scroll',
  CdkClickOutside: 'click-outside',
  CdkDraggable: 'drag-drop',
  CdkResizable: 'resize',
  CdkResizableHandle: 'resize',
  CdkResizeObserver: 'resize',
  IxAutoComplete: 'auto-complete',
  IxBackTop: 'back-top',
  IxDatePicker: 'date-picker',
  IxDateRangePicker: 'date-picker',
  IxCol: 'grid',
  IxRow: 'grid',
  IxInputNumber: 'input-number',
  IxTab: 'tabs',
  IxTreeSelect: 'tree-select',
  IxTimePicker: 'time-picker',
  IxTimeRangePicker: 'time-picker',
  IxLoadingBar: 'loading-bar',
  IxLoadingBarProvider: 'loading-bar',
}

export interface IduxResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * import style along with components
   */
  importStyle?: 'css' | 'less'
  /**
   * theme for import style
   * 
   * @default 'default' for 1.x version
   */
  importStyleTheme?: string

  /**
   * The scope of the packages.
   *
   * @default '@idux'
   */
  scope?: string

  /**
   * specify idux version to load style
   *
   * @default installed version
   */
  version?: string
}

/**
 * Resolver for `@idux/cdk`, `@idux/components` and ``@idux/pro``
 *
 * @link https://idux.site
 */
export function IduxResolver(options: IduxResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: async (name: string) => {
      const { importStyle, importStyleTheme, exclude = [], scope = '@idux' } = options

      if (exclude.includes(name))
        return

      const packageName = getPackageName(name)
      if (!packageName)
        return

      const resolvedVersion = await getPkgVersion(`${scope}/${packageName}`, '2.0.0')

      let dirname = specialComponents[name]
      if (!dirname) {
        const nameIndex = packageName === 'pro' ? 2 : 1
        dirname = kebabCase(name).split('-')[nameIndex]
      }

      const path = `${scope}/${packageName}/${dirname}`

      const sideEffects = packageName === 'cdk' ? undefined : getSideEffects(resolvedVersion, path, importStyle, importStyleTheme)

      return { name, from: path, sideEffects }
    },
  }
}

function getPackageName(name: string) {
  let packageName: 'cdk' | 'components' | 'pro' | undefined

  if (name.match(/^Cdk[A-Z]/))
    packageName = 'cdk'
  else if (name.match(/^IxPro[A-Z]/))
    packageName = 'pro'
  else if (name.match(/^Ix[A-Z]/))
    packageName = 'components'

  return packageName
}

function getSideEffects(version: string, path: string, importStyle?: 'css' | 'less', importStyleTheme?: string): string | string[] | undefined {
  if (!importStyle)
    return

  if (compare(version, '2.0.0-beta.0', '<'))
    return getLegacySideEffects(path, importStyle, importStyleTheme)

  const styleRoot = `${path}/style`
  const themeRoot = `${path}/theme`

  const styleImport = `${styleRoot}/${importStyle === 'css' ? 'index_css' : 'index'}`
  if (!resolveModule(styleImport))
    return

  const themeImport = `${themeRoot}/${importStyleTheme}.css`
  if (!importStyleTheme || !resolveModule(themeImport))
    return styleImport

  return [styleImport, `${themeRoot}/${importStyleTheme}`]
}

function getLegacySideEffects(path: string, importStyle: 'css' | 'less', importStyleTheme: string = 'default'): string | undefined {
  const styleImport = `${path}/style/themes/${importStyle === 'css' ? `${importStyleTheme}_css` : importStyleTheme}`
  if (!resolveModule(styleImport))
    return

  return styleImport
}
