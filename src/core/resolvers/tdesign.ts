import type { FilterPattern } from 'unplugin-utils'
import type { ComponentResolver } from '../../types'
import { isExclude } from '../utils'

export interface TDesignResolverOptions {
  /**
   * select the specified library
   * @default 'vue'
   */
  library?: 'vue' | 'vue-next' | 'react' | 'mobile-vue' | 'mobile-react'

  /**
   * resolve `tdesign-icons'
   * @default false
   */
  resolveIcons?: boolean

  /**
   * whether to import ESM version
   * @default false
   */
  esm?: boolean

  /**
   * exclude component name, if match do not resolve the name
   *
   */
  exclude?: FilterPattern
}

export function TDesignResolver(options: TDesignResolverOptions = {}): ComponentResolver {
  const pluginList = ['DialogPlugin', 'LoadingPlugin', 'MessagePlugin', 'NotifyPlugin']
  return {
    type: 'component',
    resolve: (name: string) => {
      const { library = 'vue', exclude } = options
      const importFrom = options.esm ? '/esm' : ''

      if (isExclude(name, exclude))
        return

      if (options.resolveIcons && name.match(/[a-z]Icon$/)) {
        return {
          name,
          from: `tdesign-icons-${library}${importFrom}`,
        }
      }

      if (name.startsWith('TTypography') || name.startsWith('Typography')) {
        return {
          name: name.slice(name.startsWith('TTypography') ? 11 : 10),
          from: `tdesign-${library}${importFrom}`,
        }
      }

      if (name.startsWith('TQrcode')) {
        return {
          name: 'QRCode',
          from: `tdesign-${library}${importFrom}`,
        }
      }

      if (name.match(/^T[A-Z]/) || pluginList.includes(name)) {
        const importName = name.match(/^T[A-Z]/) ? name.slice(1) : name

        return {
          name: importName,
          from: `tdesign-${library}${importFrom}`,
        }
      }
    },
  }
}
