import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase } from '../utils'

export interface TDesignResolverOptions {
  /**
   * import style along with components
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

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
}

function getSideEffects(importName: string, options: TDesignResolverOptions): SideEffectsInfo | undefined {
  const { library = 'vue', importStyle = 'css' } = options
  let fileName = kebabCase(importName)

  if (!importStyle)
    return

  if (fileName === 'config-provider')
    return

  if (fileName.includes('-') && fileName !== 'input-number') {
    const prefix = fileName.slice(0, fileName.indexOf('-'))
    const container = ['anchor', 'avatar', 'breadcrumb', 'checkbox', 'dropdown', 'form', 'input', 'list', 'menu', 'radio', 'slider', 'steps', 'swiper']

    if (container.includes(prefix))
      fileName = prefix
  }

  if (['row', 'col'].includes(fileName))
    fileName = 'grid'

  if (fileName === 'addon')
    fileName = 'input'

  if (['aside', 'layout', 'header', 'footer', 'content'].includes(fileName))
    fileName = 'layout'

  if (['option', 'option-group'].includes(fileName))
    fileName = 'select'

  if (['tab-nav', 'tab-panel'].includes(fileName))
    fileName = 'tabs'

  if (fileName === 'check-tag')
    fileName = 'tag'

  if (fileName === 'time-range-picker')
    fileName = 'time-picker'

  if (importStyle === 'less')
    return `tdesign-${library}/esm/${fileName}/style`

  return `tdesign-${library}/es/${fileName}/style`
}

export function TDesignResolver(options: TDesignResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { library = 'vue' } = options

      if (options.resolveIcons && name.match(/[a-z]Icon$/)) {
        return {
          importName: name,
          path: `tdesign-icons-${library}`,
        }
      }

      if (name.match(/^T[A-Z]/)) {
        const importName = name.slice(1)

        return {
          importName,
          path: `tdesign-${library}`,
          sideEffects: getSideEffects(importName, options),
        }
      }
    },
  }
}
