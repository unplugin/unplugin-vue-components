import Debug from 'debug'
import type { ComponentInfo, ComponentResolver } from '../../types'
import { kebabCase, pascalCase } from '../utils'
import { isExclude } from './_utils'

const debug = Debug('unplugin-vue-components:resolvers:arco')

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
    pattern: /^CascaderPanel$/,
    componentDir: 'cascader',
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
    pattern: /^DescriptionsItem$/,
    componentDir: 'descriptions',
  },
  {
    pattern: /^(Doption|Dgroup|Dsubmenu|DropdownButton)$/,
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
    componentDir: 'skeleton',
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
    pattern: /^TagGroup$/,
    componentDir: 'tag',
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

function canResolveIcons(options?: ResolveIconsOption): options is AllowResolveIconOption {
  if (options === undefined)
    return false
  if (typeof options === 'boolean')
    return options
  else
    return options.enable
}

function getResolveIconPrefix(options?: ResolveIconsOption) {
  if (canResolveIcons(options)) {
    if (typeof options === 'boolean' && options)
      return ''
    else if (options.enable)
      return options.iconPrefix ?? ''
    else
      return ''
  }
  return ''
}

export type DisallowResolveIconOption = undefined | false | { enable: false }
export type AllowResolveIconOption = true | { enable: true, iconPrefix?: string }
export type ResolveIconsOption = DisallowResolveIconOption | AllowResolveIconOption

export interface ArcoResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string | RegExp | (string | RegExp)[]
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
  resolveIcons?: ResolveIconsOption
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
      if (canResolveIcons(options.resolveIcons)) {
        const iconPrefix = pascalCase(getResolveIconPrefix(options.resolveIcons))
        const newNameRegexp = new RegExp(`^${iconPrefix}Icon`)
        if (newNameRegexp.test(name)) {
          debug('found icon component name %s', name)
          const rawComponentName = name.slice(iconPrefix.length)
          debug('found icon component raw name %s', rawComponentName)
          return {
            name: rawComponentName,
            as: name,
            from: '@arco-design/web-vue/es/icon',
          }
        }
      }
      if (name.match(/^A[A-Z]/) && !isExclude(name, options.exclude)) {
        const importStyle = options.importStyle ?? 'css'

        const importName = name.slice(1)
        const config: ComponentInfo = {
          name: importName,
          from: '@arco-design/web-vue',
        }
        if (options.sideEffect !== false)
          config.sideEffects = getComponentStyleDir(importName, importStyle)
        return config
      }
    },
  }
}
