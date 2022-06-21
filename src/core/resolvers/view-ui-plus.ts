import type { ComponentResolveResult, ComponentResolver } from '../../types'

export interface ViewUIPlusResolverOptions {
  /**
   * import style
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'
}

function getResolved(name: string, options: ViewUIPlusResolverOptions): ComponentResolveResult {
  const { importStyle = 'css' } = options
  const path = 'view-ui-plus'
  const sideEffects: string[] = [
    'js-calendar',
    'numeral',
    'tinycolor2',
    'dayjs',
    'popper.js',
    'js-calendar',
    'countup.js',
    'lodash.chunk',
    'lodash.throttle',
    'element-resize-detector',
    'popper.js/dist/umd/popper.js',
  ]

  if (importStyle) {
    sideEffects.push(
      importStyle === 'less'
        ? `${path}/src/styles/index.less`
        : `${path}/dist/styles/viewuiplus.css`,
    )
  }

  return {
    name,
    from: `${path}/src`,
    sideEffects,
  }
}

/**
 * Resolver for view-ui-plus
 */
export function ViewUIPlusResolver(options: ViewUIPlusResolverOptions = {}): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (usedComponents.includes(name))
          return getResolved(name, options)
      },
    },
  ]
}

const usedComponents: string[] = [
  'Affix',
  'Alert',
  'Anchor',
  'AnchorLink',
  'Auth',
  'AutoComplete',
  'Avatar',
  'AvatarList',
  'BackTop',
  'Badge',
  'Breadcrumb',
  'BreadcrumbItem',
  'Button',
  'ButtonGroup',
  'Calendar',
  'Captcha',
  'Card',
  'Carousel',
  'CarouselItem',
  'Cascader',
  'Cell',
  'CellGroup',
  'Checkbox',
  'CheckboxGroup',
  'Circle',
  'City',
  'Col',
  'Collapse',
  'ColorPicker',
  'Content',
  'CountDown',
  'CountUp',
  'DatePicker',
  'Description',
  'DescriptionList',
  'Divider',
  'Drawer',
  'Dropdown',
  'DropdownItem',
  'DropdownMenu',
  'Ellipsis',
  'Email',
  'Exception',
  'Footer',
  'FooterToolbar',
  'Form',
  'FormItem',
  'GlobalFooter',
  'Grid',
  'GridItem',
  'Header',
  'Icon',
  'Image',
  'ImagePreview',
  'Input',
  'InputNumber',
  'Layout',
  'Link',
  'List',
  'ListItem',
  'ListItemMeta',
  'LoadingBar',
  'Login',
  'Menu',
  'MenuGroup',
  'MenuItem',
  'Message',
  'Mobile',
  'Modal',
  'Notice',
  'Notification',
  'NotificationItem',
  'NotificationTab',
  'NumberInfo',
  'Numeral',
  'Option',
  'OptionGroup',
  'Page',
  'PageHeader',
  'Panel',
  'Paragraph',
  'Password',
  'Poptip',
  'Progress',
  'Radio',
  'RadioGroup',
  'Rate',
  'Result',
  'Row',
  'Scroll',
  'Select',
  'Sider',
  'Skeleton',
  'SkeletonItem',
  'Slider',
  'Space',
  'Spin',
  'Split',
  'Step',
  'Steps',
  'Submenu',
  'Submit',
  'Switch',
  'Table',
  'TablePaste',
  'TabPane',
  'Tabs',
  'Tag',
  'TagSelect',
  'TagSelectOption',
  'Text',
  'Time',
  'Timeline',
  'TimelineItem',
  'TimePicker',
  'Title',
  'Tooltip',
  'Transfer',
  'Tree',
  'TreeSelect',
  'Trend',
  'Typography',
  'Upload',
  'UserName',
  'WordCount',
]
