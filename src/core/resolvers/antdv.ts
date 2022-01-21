import { resolve } from 'path'
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
   *
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

  if (importStyle === 'less' || importLess) {
    const styleDir = getStyleDir(compName)
    return `ant-design-vue/${lib}/${styleDir}/style`
  }
  else {
    const styleDir = getStyleDir(compName)
    return `ant-design-vue/${lib}/${styleDir}/style/css`
  }
}
const primitiveNames = ['Affix', 'Anchor', 'AnchorLink', 'AutoComplete', 'AutoCompleteOptGroup', 'AutoCompleteOption', 'Alert', 'Avatar', 'AvatarGroup', 'BackTop', 'Badge', 'BadgeRibbon', 'Breadcrumb', 'BreadcrumbItem', 'BreadcrumbSeparator', 'Button', 'ButtonGroup', 'Calendar', 'Card', 'CardGrid', 'CardMeta', 'Collapse', 'CollapsePanel', 'Carousel', 'Cascader', 'Checkbox', 'CheckboxGroup', 'Col', 'Comment', 'ConfigProvider', 'DatePicker', 'MonthPicker', 'WeekPicker', 'RangePicker', 'QuarterPicker', 'Descriptions', 'DescriptionsItem', 'Divider', 'Dropdown', 'DropdownButton', 'Drawer', 'Empty', 'Form', 'FormItem', 'FormItemRest', 'Grid', 'Input', 'InputGroup', 'InputPassword', 'InputSearch', 'Textarea', 'Image', 'ImagePreviewGroup', 'InputNumber', 'Layout', 'LayoutHeader', 'LayoutSider', 'LayoutFooter', 'LayoutContent', 'List', 'ListItem', 'ListItemMeta', 'Menu', 'MenuDivider', 'MenuItem', 'MenuItemGroup', 'SubMenu', 'Mentions', 'MentionsOption', 'Modal', 'Statistic', 'StatisticCountdown', 'PageHeader', 'Pagination', 'Popconfirm', 'Popover', 'Progress', 'Radio', 'RadioButton', 'RadioGroup', 'Rate', 'Result', 'Row', 'Select', 'SelectOptGroup', 'SelectOption', 'Skeleton', 'SkeletonButton', 'SkeletonAvatar', 'SkeletonInput', 'SkeletonImage', 'Slider', 'Space', 'Spin', 'Steps', 'Step', 'Switch', 'Table', 'TableColumn', 'TableColumnGroup', 'TableSummary', 'TableSummaryRow', 'TableSummaryCell', 'Transfer', 'Tree', 'TreeNode', 'DirectoryTree', 'TreeSelect', 'TreeSelectNode', 'Tabs', 'TabPane', 'Tag', 'CheckableTag', 'TimePicker', 'TimeRangePicker', 'Timeline', 'TimelineItem', 'Tooltip', 'Typography', 'TypographyLink', 'TypographyParagraph', 'TypographyText', 'TypographyTitle', 'Upload', 'UploadDragger', 'LocaleProvider']
const prefix = 'A'

let antdvNames: Set<string>

function genAntdNames(primitiveNames: string[]): void {
  antdvNames = new Set(primitiveNames.map(name => `${prefix}${name}`))
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
          importName: name,
          path: '@ant-design/icons-vue',
        }
      }

      if (isAntdv(name) && !options?.exclude?.includes(name)) {
        const importName = name.slice(1)
        const { cjs = false } = options
        const path = `ant-design-vue/${cjs ? 'lib' : 'es'}`
        return {
          importName,
          path,
          sideEffects: getSideEffects(importName, options),
        }
      }
    },
    getAllComponentNames: () => {
      return [...antdvNames]
    },
  }
}
