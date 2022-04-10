import type { ComponentInfo, ComponentResolver } from '../../types'
import { kebabCase } from '../utils'

const matchComponents = [
  {
    pattern: /^AnchorLink$/,
    componentDir: 'anchor',
  },
  {
    pattern: /^AvatarGroup$/,
    componentDir: 'avatar',
  },
  {
    pattern: /^BreadcrumbItem$/,
    componentDir: 'breadcrumb',
  },
  {
    pattern: /^ButtonGroup$/,
    componentDir: 'button',
  },
  {
    pattern: /^(CardMeta|CardGrid)$/,
    componentDir: 'card',
  },
  {
    pattern: /^CarouselItem$/,
    componentDir: 'carousel',
  },
  {
    pattern: /^CheckboxGroup$/,
    componentDir: 'checkbox',
  },
  {
    pattern: /^CollapseItem$/,
    componentDir: 'collapse',
  },
  {
    pattern: /^(WeekPicker|MonthPicker|YearPicker|QuarterPicker|RangePicker)$/,
    componentDir: 'date-picker',
  },
  {
    pattern: /^(Doption|Dgroup|Dsubmenu)$/,
    componentDir: 'dropdown',
  },
  {
    pattern: /^FormItem$/,
    componentDir: 'form',
  },
  {
    pattern: /^(Col|Row|GridItem)$/,
    componentDir: 'grid',
  },

  {
    pattern: /^(ImagePreview|ImagePreviewGroup)$/,
    componentDir: 'image',
  },
  {
    pattern: /^(InputGroup|InputSearch|InputPassword)$/,
    componentDir: 'input',
  },

  {
    pattern: /^(LayoutHeader|LayoutContent|LayoutFooter|LayoutSider)$/,
    componentDir: 'layout',
  },
  {
    pattern: /^(ListItem|ListItemMeta)$/,
    componentDir: 'list',
  },
  {
    pattern: /^(MenuItem|MenuItemGroup|SubMenu)$/,
    componentDir: 'menu',
  },
  {
    pattern: /^RadioGroup$/,
    componentDir: 'radio',
  },
  {
    pattern: /^(Option|Optgroup)$/,
    componentDir: 'select',
  },

  {
    pattern: /^(SkeletonLine|SkeletonShape)$/,
    componentDir: 'table',
  },
  {
    pattern: /^Countdown$/,
    componentDir: 'statistic',
  },

  {
    pattern: /^Step$/,
    componentDir: 'steps',
  },

  {
    pattern: /^(Thead|Td|Th|Tr|Tbody|TableColumn)$/,
    componentDir: 'table',
  },

  {
    pattern: /^TabPane$/,
    componentDir: 'tabs',
  },
  {
    pattern: /^TimelineItem$/,
    componentDir: 'timeline',
  },

  {
    pattern: /^(TypographyParagraph|TypographyTitle|TypographyText)$/,
    componentDir: 'typography',
  },

  {
    pattern: /^DescriptionsItem$/,
    componentDir: 'descriptions',
  },
]

function getComponentStyleDir(importName: string, importStyle: boolean | 'css' | 'less') {
  if (['ConfigProvider', 'Icon'].includes(importName))
    return undefined

  let componentDir = kebabCase(importName)
  for (const item of matchComponents) {
    if (item.pattern.test(importName)) {
      componentDir = item.componentDir
      break
    }
  }
  if (importStyle === 'less')
    return `@arco-design/web-vue/es/${componentDir}/style/index.js`
  if (importStyle === 'css' || importStyle)
    return `@arco-design/web-vue/es/${componentDir}/style/css.js`
}

export interface ArcoResolverOptions {
  /**
   * import style css or less with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'
  /**
   * resolve icons
   *
   * @default false
   */
  resolveIcons?: boolean
  /**
   * Control style automatic import
   *
   * @default true
   */
  sideEffect?: boolean
}

/**
 * Resolver for Arco Design Vue
 *
 * Requires arco-design/web-vue@2.11.0 or later
 *
 * @author @flsion
 * @link https://arco.design/ for arco-design
 *
 */
export function ArcoResolver(
  options: ArcoResolverOptions = {},
): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.resolveIcons && name.match(/^Icon/)) {
        return {
          name,
          from: '@arco-design/web-vue/es/icon',
        }
      }
      if (name.match(/^A[A-Z]/)) {
        const importStyle = options.importStyle ?? 'css'

        const importName = name.slice(1)
        const config: ComponentInfo = {
          as: importName,
          from: '@arco-design/web-vue',
        }
        if (options.sideEffect !== false)
          config.sideEffects = getComponentStyleDir(importName, importStyle)
        return config
      }
    },
  }
}
