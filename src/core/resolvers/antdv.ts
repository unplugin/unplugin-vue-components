import type { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase } from '../utils'

interface IMatcher {
  pattern: RegExp
  styleDir: string
}

const matchComponents: IMatcher[] = [
  {
    pattern: /^Avatar/,
    styleDir: 'avatar',
  },
  {
    pattern: /^AutoComplete/,
    styleDir: 'auto-complete',
  },
  {
    pattern: /^Anchor/,
    styleDir: 'anchor',
  },

  {
    pattern: /^Badge/,
    styleDir: 'badge',
  },
  {
    pattern: /^Breadcrumb/,
    styleDir: 'breadcrumb',
  },
  {
    pattern: /^Button/,
    styleDir: 'button',
  },
  {
    pattern: /^Checkbox/,
    styleDir: 'checkbox',
  },
  {
    pattern: /^Card/,
    styleDir: 'card',
  },
  {
    pattern: /^Collapse/,
    styleDir: 'collapse',
  },
  {
    pattern: /^Descriptions/,
    styleDir: 'descriptions',
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: 'date-picker',
  },
  {
    pattern: /^Dropdown/,
    styleDir: 'dropdown',
  },

  {
    pattern: /^Form/,
    styleDir: 'form',
  },
  {
    pattern: /^InputNumber/,
    styleDir: 'input-number',
  },

  {
    pattern: /^Input|^Textarea/,
    styleDir: 'input',
  },
  {
    pattern: /^Statistic/,
    styleDir: 'statistic',
  },
  {
    pattern: /^CheckableTag/,
    styleDir: 'tag',
  },
  {
    pattern: /^TimeRangePicker/,
    styleDir: 'time-picker',
  },
  {
    pattern: /^Layout/,
    styleDir: 'layout',
  },
  {
    pattern: /^Menu|^SubMenu/,
    styleDir: 'menu',
  },

  {
    pattern: /^Table/,
    styleDir: 'table',
  },
  {
    pattern: /^TimePicker|^TimeRangePicker/,
    styleDir: 'time-picker',
  },
  {
    pattern: /^Radio/,
    styleDir: 'radio',
  },

  {
    pattern: /^Image/,
    styleDir: 'image',
  },

  {
    pattern: /^List/,
    styleDir: 'list',
  },

  {
    pattern: /^Tab/,
    styleDir: 'tabs',
  },
  {
    pattern: /^Mentions/,
    styleDir: 'mentions',
  },

  {
    pattern: /^Step/,
    styleDir: 'steps',
  },
  {
    pattern: /^Skeleton/,
    styleDir: 'skeleton',
  },

  {
    pattern: /^Select/,
    styleDir: 'select',
  },
  {
    pattern: /^TreeSelect/,
    styleDir: 'tree-select',
  },
  {
    pattern: /^Tree|^DirectoryTree/,
    styleDir: 'tree',
  },
  {
    pattern: /^Typography/,
    styleDir: 'typography',
  },
  {
    pattern: /^Timeline/,
    styleDir: 'timeline',
  },
  {
    pattern: /^Upload/,
    styleDir: 'upload',
  },
]

export interface AntDesignVueResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * import style along with components
   *  - `true` - import style from `ant-design-vue/es/compName/style/css`
   *  - `false` - do not import style (ant-design-vue 4.0+)
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'
  /**
   * resolve `ant-design-vue' icons
   *
   * requires package `@ant-design/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean
  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean

  /**
   * use commonjs build default false
   */
  cjs?: boolean

  /**
   * rename package
   *
   * @default 'ant-design-vue'
   */
  packageName?: string
}

function getStyleDir(compName: string): string {
  let styleDir
  const total = matchComponents.length
  for (let i = 0; i < total; i++) {
    const matcher = matchComponents[i]
    if (compName.match(matcher.pattern)) {
      styleDir = matcher.styleDir
      break
    }
  }
  if (!styleDir)
    styleDir = kebabCase(compName)

  return styleDir
}

function getSideEffects(compName: string, options: AntDesignVueResolverOptions): SideEffectsInfo {
  const {
    importStyle = true,
    importLess = false,
  } = options

  if (!importStyle)
    return
  const lib = options.cjs ? 'lib' : 'es'
  const packageName = options?.packageName || 'ant-design-vue'

  if (importStyle === 'less' || importLess) {
    const styleDir = getStyleDir(compName)
    return `${packageName}/${lib}/${styleDir}/style`
  }
  else {
    const styleDir = getStyleDir(compName)
    return `${packageName}/${lib}/${styleDir}/style/css`
  }
}
const primitiveNames = [
  'Affix',
  'Alert',
  'Anchor',
  'AnchorLink',
  'AutoComplete',
  'Avatar',
  'BackTop',
  'Badge',
  'Breadcrumb',
  'BreadcrumbItem',
  'Button',
  'ButtonGroup',
  'Calendar',
  'Card',
  'CardGrid',
  'CardMeta',
  'Carousel',
  'CarouselItem',
  'Cascader',
  'Checkbox',
  'CheckboxButton',
  'CheckboxGroup',
  'Col',
  'Collapse',
  'CollapsePanel',
  'ColorPicker',
  'ConfigProvider',
  'DatePicker',
  'DateRangePicker',
  'Descriptions',
  'DescriptionsItem',
  'Divider',
  'Drawer',
  'Dropdown',
  'DropdownButton',
  'Empty',
  'Form',
  'FormItem',
  'FormModel',
  'Grid',
  'Icon',
  'Image',
  'Input',
  'InputNumber',
  'Layout',
  'LayoutContent',
  'LayoutFooter',
  'LayoutHeader',
  'LayoutSider',
  'List',
  'ListItem',
  'ListItemMeta',
  'LocaleProvider',
  'Mentions',
  'Menu',
  'MenuDivider',
  'MenuItem',
  'MenuItemGroup',
  'Message',
  'Modal',
  'PageHeader',
  'Pagination',
  'Popconfirm',
  'Popover',
  'Progress',
  'Radio',
  'RadioButton',
  'RadioGroup',
  'Rate',
  'Result',
  'Row',
  'Select',
  'SelectOption',
  'SelectOptionGroup',
  'Skeleton',
  'SkeletonAvatar',
  'SkeletonButton',
  'SkeletonImage',
  'SkeletonInput',
  'Slider',
  'Space',
  'SpaceCompact',
  'Spin',
  'Statistic',
  'StatisticCountdown',
  'Step',
  'Steps',
  'SubMenu',
  'Switch',
  'TabPane',
  'Table',
  'TableColumn',
  'TableColumnGroup',
  'TableSummary',
  'TableSummaryCell',
  'TableSummaryRow',
  'Tabs',
  'Tag',
  'Textarea',
  'TimePicker',
  'TimeRangePicker',
  'Timeline',
  'TimelineItem',
  'Tooltip',
  'Transfer',
  'Tree',
  'TreeNode',
  'TreeSelect',
  'TreeSelectNode',
  'Typography',
  'TypographyLink',
  'TypographyParagraph',
  'TypographyText',
  'TypographyTitle',
  'Upload',
  'UploadDragger',
  'WeekPicker',
  'QRCode',
  'Tour',
  'FloatButton',
  'FloatButtonGroup',
  'BackTop',
  'Watermark',
  'StyleProvider',
]
const prefix = 'A'

let antdvNames: Set<string>

function genAntdNames(primitiveNames: string[]): void {
  antdvNames = new Set(primitiveNames.map((name) => {
    return `${prefix}${name}`
  }))
}
genAntdNames(primitiveNames)

function isAntdv(compName: string): boolean {
  return antdvNames.has(compName)
}

/**
 * Resolver for Ant Design Vue
 *
 * Requires ant-design-vue@v2.2.0-beta.6 or later
 *
 * See https://github.com/antfu/unplugin-vue-components/issues/26#issuecomment-789767941 for more details
 *
 * @author @yangss3
 * @link https://antdv.com/
 */
export function AntDesignVueResolver(options: AntDesignVueResolverOptions = {

}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
        return {
          name,
          from: '@ant-design/icons-vue',
        }
      }
      if ((isAntdv(name) && !options?.exclude?.includes(name)) || name === 'AQrcode') {
        const importName = name === 'AQrcode' ? 'QRCode' : name.slice(1)
        const { cjs = false, packageName = 'ant-design-vue' } = options
        const path = `${packageName}/${cjs ? 'lib' : 'es'}`
        return {
          name: importName,
          from: path,
          sideEffects: getSideEffects(importName, options),
        }
      }
    },
  }
}
