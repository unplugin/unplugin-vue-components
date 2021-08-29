import { ComponentResolver, SideEffectsInfo } from '../../types'
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

  if (importStyle === 'less' || importLess) {
    const styleDir = getStyleDir(compName)
    return `ant-design-vue/es/${styleDir}/style`
  }
  else {
    const styleDir = getStyleDir(compName)
    return `ant-design-vue/es/${styleDir}/style/css`
  }
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
export function AntDesignVueResolver(options: AntDesignVueResolverOptions = {}): ComponentResolver {
  return (name: string) => {
    if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
      return {
        importName: name,
        path: '@ant-design/icons-vue',
      }
    }

    if (name.match(/^A[A-Z]/)) {
      const importName = name.slice(1)
      return {
        importName,
        path: 'ant-design-vue/es',
        sideEffects: getSideEffects(importName, options),
      }
    }
  }
}
