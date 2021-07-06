import { ComponentResolver } from '../types'
import { kebabCase } from '../utils'

/**
 * Resolver for Ant Design Vue
 *
 * Requires ant-design-vue@v2.2.0-beta.6 or later
 *
 * See https://github.com/antfu/vite-plugin-components/issues/26#issuecomment-789767941 for more details
 *
 * @author @yangss3
 * @link https://antdv.com/
 */

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
]

export interface AntDesignVueResolverOptions {
  /**
   * import style along with components
   *
   * @default true
   */
  importStyle?: boolean
  /**
   * import css along with components
   *
   * @default true
   */
  importCss?: boolean
  /**
   * import less along with components
   *
   * @default false
   */
  importLess?: boolean

  /**
   * should resolve `ant-design-vue' icons 
   * 
   * required package `@ant-design/icons-vue`
   * 
   * @default undefined
   */
  resolveIcons?: boolean;
}

const getStyleDir = (compName: string): string => {
  let styleDir
  const total = matchComponents.length
  for (let i = 0; i < total; i++) {
    const matcher = matchComponents[i]
    if (compName.match(matcher.pattern)) {
      styleDir = matcher.styleDir
      break
    }
  }
  if (!styleDir) styleDir = kebabCase(compName)

  return styleDir
}

const getSideEffects: (
  compName: string,
  opts: AntDesignVueResolverOptions
) => string | undefined = (compName, opts) => {
  const { importStyle = true, importCss = true, importLess = false } = opts

  if (importStyle) {
    if (importLess) {
      const styleDir = getStyleDir(compName)
      return `ant-design-vue/es/${styleDir}/style`
    }
    else if (importCss) {
      const styleDir = getStyleDir(compName)
      return `ant-design-vue/es/${styleDir}/style/css`
    }
  }
}

export const AntDesignVueResolver
  = (options: AntDesignVueResolverOptions = {}): ComponentResolver =>
    (name: string) => {
      if(options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)){
        return {
          importName: name,
          path: "@ant-design/icons-vue"
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
