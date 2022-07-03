import { kebabCase } from '../utils'

import type { ComponentInfo, ComponentResolver } from '../../types'

const components = [
  'Alert',
  'Anchor',
  'AnchorLink',
  'AutoComplete',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'Breadcrumb',
  'BreadcrumbItem',
  'Bubble',
  'Button',
  'ButtonGroup',
  'Calendar',
  'CalendarPane',
  'Card',
  'Carousel',
  'CarouselItem',
  'Cascader',
  'Cell',
  'Checkbox',
  'CheckboxGroup',
  'Collapse',
  'CollapsePane',
  'CollapseTransition',
  'ColorPicker',
  'Column',
  'ConfigProvider',
  'DatePicker',
  'Divider',
  'Drawer',
  'Dropdown',
  'DropdownItem',
  'DropdownList',
  'Ellipsis',
  'Form',
  'FormItem',
  'FormReset',
  'FormSubmit',
  'Grid',
  'Highlight',
  'Icon',
  'Input',
  'Linker',
  'Masker',
  'Menu',
  'MenuGroup',
  'MenuItem',
  'Modal',
  'NativeScroll',
  'NumberInput',
  'Option',
  'OptionGroup',
  'Pagination',
  'Popup',
  'Portal',
  'Progress',
  'Radio',
  'RadioGroup',
  'Renderer',
  'ResizeObserver',
  'Row',
  'Scroll',
  'Scrollbar',
  'Select',
  'Skeleton',
  'SkeletonGroup',
  'Slider',
  'Space',
  'Spin',
  'Split',
  'Switch',
  'TabNav',
  'TabNavItem',
  'TabPane',
  'Table',
  'TableColumn',
  'Tabs',
  'Tag',
  'Textarea',
  'TimeAgo',
  'TimePicker',
  'Timeline',
  'TimelineItem',
  'Tooltip',
  'Tree',
  'Upload',
  'UploadFile',
  'UploadList',
  'Viewer',
  'VirtualList',
  'Wheel',
  'WheelItem',
]

const directives: Record<string, { name: string; component: string }> = {
  Loading: { name: 'loading', component: 'spin' },
}

export interface VexipUIResolverOptions {
  /**
   * import css or sass styles with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'
  /**
   * import the dark theme preset styles
   *
   * @default false
   */
  importDarkTheme?: boolean
  /**
   * prefix for name of components
   *
   * @default ''
   */
  prefix?: string
  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean
}

function getSideEffects(name: string, options: VexipUIResolverOptions) {
  const { importStyle, importDarkTheme } = options

  if (!importStyle)
    return

  if (importStyle === 'sass') {
    return [
      'vexip-ui/style/preset.scss',
      ...(importDarkTheme ? ['vexip-ui/style/dark/preset.scss'] : []),
      `vexip-ui/style/${name}.scss`,
    ]
  }
  else if (importStyle === true || importStyle === 'css') {
    return [
      'vexip-ui/css/preset.css',
      ...(importDarkTheme ? ['vexip-ui/theme/dark/index.css'] : []),
      `vexip-ui/css/${name}.css`,
    ]
  }
}

function resolveComponent(name: string, options: VexipUIResolverOptions): ComponentInfo | undefined {
  const { prefix } = options

  if (prefix) {
    if (!name.startsWith(prefix))
      return

    name = name.substring(prefix.length)
  }

  if (!components.includes(name))
    return

  return {
    name,
    from: 'vexip-ui',
    sideEffects: getSideEffects(kebabCase(name), options),
  }
}

function resolveDirective(name: string, options: VexipUIResolverOptions): ComponentInfo | undefined {
  if (!options.directives)
    return

  const directive = directives[name]

  if (!directive)
    return

  return {
    name: directive.name,
    from: `vexip-ui/es/${directive.component}`,
    sideEffects: getSideEffects(directive.component, options),
  }
}

/**
 * Resolver for Vexip UI
 *
 * @author @qmhc
 * @link https://www.vexipui.com/
 *
 */
export function VexipUIResolver(
  options: VexipUIResolverOptions = {},
): ComponentResolver[] {
  options = { importStyle: 'css', directives: true, ...options }

  return [
    {
      type: 'component',
      resolve: (name: string) => {
        return resolveComponent(name, options)
      },
    },
    {
      type: 'directive',
      resolve: (name: string) => {
        return resolveDirective(name, options)
      },
    },
  ]
}
