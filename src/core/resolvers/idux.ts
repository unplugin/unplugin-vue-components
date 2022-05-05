import type { ComponentResolver } from '../../types'
import { kebabCase } from '../utils'

const specialComponents: Record<string, string> = {
  CdkVirtualScroll: 'scroll',
  IxAutoComplete: 'auto-complete',
  IxBackTop: 'back-top',
  IxDatePicker: 'date-picker',
  IxCol: 'grid',
  IxRow: 'grid',
  IxInputNumber: 'input-number',
  IxTab: 'tabs',
  IxTreeSelect: 'tree-select',
  IxTimePicker: 'time-picker',
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
}

/**
 * Resolver for `@idux/cdk`, `@idux/components` and ``@idux/pro``
 *
 * @link https://idux.site
 */
export function IduxResolver(options: IduxResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { importStyle, exclude = [] } = options
      if (exclude.includes(name))
        return

      const packageName = getPackageName(name)
      if (!packageName)
        return

      let dirname = specialComponents[name]
      if (!dirname) {
        const nameIndex = packageName === 'pro' ? 2 : 1
        dirname = kebabCase(name).split('-')[nameIndex]
      }

      const path = `@idux/${packageName}/${dirname}`

      let sideEffects: string | undefined
      if (packageName !== 'cdk' && importStyle)
        sideEffects = `${path}/style/themes/${importStyle === 'css' ? 'default_css' : 'default'}`

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
