import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase } from '../utils'

export interface VantResolverOptions {
  /**
   * import style css or less along with components
   *
   * @default true
   */
  importStyle?: boolean | 'css' | 'less'
}

const primitiveNames = [
  'ActionBar',
  'ActionBarButton',
  'ActionBarIcon',
  'ActionSheet',
  'AddressEdit',
  'AddressList',
  'Area',
  'Badge',
  'Button',
  'Calendar',
  'Card',
  'Cascader',
  'Cell',
  'CellGroup',
  'Checkbox',
  'CheckboxGroup',
  'Circle',
  'Col',
  'Collapse',
  'CollapseItem',
  'ConfigProvider',
  'ContactCard',
  'ContactEdit',
  'ContactList',
  'CountDown',
  'Coupon',
  'CouponCell',
  'CouponList',
  'DatetimePicker',
  'Dialog',
  'Divider',
  'DropdownItem',
  'DropdownMenu',
  'Empty',
  'Field',
  'Form',
  'Grid',
  'GridItem',
  'Icon',
  'Image',
  'ImagePreview',
  'IndexAnchor',
  'IndexBar',
  'List',
  'Loading',
  'Locale',
  'NavBar',
  'NoticeBar',
  'Notify',
  'NumberKeyboard',
  'Overlay',
  'Pagination',
  'PasswordInput',
  'Picker',
  'Popover',
  'Popup',
  'Progress',
  'PullRefresh',
  'Radio',
  'RadioGroup',
  'Rate',
  'Row',
  'Search',
  'ShareSheet',
  'Sidebar',
  'SidebarItem',
  'Skeleton',
  'Slider',
  'Step',
  'Stepper',
  'Steps',
  'Sticky',
  'SubmitBar',
  'Swipe',
  'SwipeCell',
  'SwipeItem',
  'Switch',
  'Tab',
  'Tabbar',
  'TabbarItem',
  'Tabs',
  'Tag',
  'Toast',
  'TreeSelect',
  'Uploader',
]

const prefix = 'Van'

let vantNames: Set<string>

function genVantNames(primitiveNames: string[]): void {
  vantNames = new Set(primitiveNames.map(name => `${prefix}${name}`))
}
genVantNames(primitiveNames)

function getSideEffects(dirName: string, options: VantResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = true } = options

  if (!importStyle)
    return

  if (importStyle === 'less')
    return `vant/es/${dirName}/style/less`

  if (importStyle === 'css')
    return `vant/es/${dirName}/style/index`

  return `vant/es/${dirName}/style/index`
}

/**
 * Resolver for Vant
 *
 * @link https://github.com/youzan/vant
 */
export function VantResolver(options: VantResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Van')) {
        const partialName = name.slice(3)
        return {
          importName: partialName,
          path: 'vant/es',
          sideEffects: getSideEffects(kebabCase(partialName), options),
        }
      }
    },
    getAllComponentNames: () => {
      return [...vantNames]
    },
  }
}
