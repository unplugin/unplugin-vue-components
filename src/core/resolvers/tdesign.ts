import { ComponentResolver, SideEffectsInfo } from '../../types'
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
  const fileName = kebabCase(importName)

  if (!importStyle) return

  if (importStyle === 'less') return `tdesign-${library}/esm/${fileName}/style`

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
