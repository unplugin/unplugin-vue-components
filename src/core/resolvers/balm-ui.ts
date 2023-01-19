import { kebabCase } from '../utils'
import type { ComponentResolver, SideEffectsInfo } from '../../types'

const BalmUIDirectiveStyles = ['elevation', 'ripple', 'shape']

export interface BalmUIResolverOptions {
  /**
   * import style along with components
   *
   * @default false
   */
  importStyle?: false | 'css' | 'sass'
  /**
   * Use BalmUI source code.
   *
   * @default false
   */
  useSource?: boolean
}

function getFromSource(type: string, name: string, options: BalmUIResolverOptions): string {
  const unpluginList = type === 'component'
    ? ['UiSkeleton', 'UiEditor', 'UiTree', 'UiBottomNavigation', 'UiBottomSheet']
    : ['Anchor', 'Copy', 'Longpress']
  const isPlus = unpluginList.includes(name)

  return options.useSource
    ? (isPlus ? 'balm-ui/src/scripts/plus.js' : 'balm-ui/src/scripts/index.js')
    : (isPlus ? 'balm-ui/dist/balm-ui-plus.js' : 'balm-ui/dist/balm-ui.js')
}

function getSideEffects(type: string, name: string, options: BalmUIResolverOptions): SideEffectsInfo {
  const styleExtname = options.importStyle === 'sass' ? 'scss' : 'css'

  return `balm-ui/${type}s/${name}/${name}.${styleExtname}`
}

/**
 * Resolver for BalmUI
 *
 * @author @elf-mouse
 * @link https://material.balmjs.com/
 */
export function BalmUIResolver(options: BalmUIResolverOptions = {}): ComponentResolver[] {
  return [{
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Ui')) {
        const partialName = kebabCase(name.slice(2))

        return {
          name,
          from: getFromSource('component', name, options),
          sideEffects: options.importStyle
            ? getSideEffects('component', partialName, options)
            : undefined,
        }
      }
    },
  }, {
    type: 'directive',
    resolve: (name: string) => {
      const partialName = kebabCase(name)

      return {
        name: `v${name}`,
        from: getFromSource('directive', name, options),
        sideEffects: options.importStyle && BalmUIDirectiveStyles.includes(partialName)
          ? getSideEffects('directive', partialName, options)
          : undefined,
      }
    },
  }]
}
