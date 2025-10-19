import type { ComponentResolver, SideEffectsInfo } from '../../types'

// @keep-sorted
const components = [
  'Accordion',
  'AccordionTab',
  'AutoComplete',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'BlockUI',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'Carousel',
  'CascadeSelect',
  'Chart',
  'Checkbox',
  'Chip',
  'Chips',
  'ColorPicker',
  'Column',
  'ColumnGroup',
  // 'ConfirmDialog',
  // 'ConfirmPopup',
  // These must be registered globally in order for the confirm service to work properly
  'ContextMenu',
  'DataTable',
  'DataView',
  'DataViewLayoutOptions',
  'DeferredContent',
  'Dialog',
  'Divider',
  'Dock',
  'Dropdown',
  'Editor',
  'Fieldset',
  'FileUpload',
  'FloatLabel',
  'FullCalendar',
  'Galleria',
  'IconField',
  'IconField',
  'Image',
  'InlineMessage',
  'Inplace',
  'InputGroup',
  'InputGroupAddon',
  'InputIcon',
  'InputMask',
  'InputNumber',
  'InputOtp',
  'InputSwitch',
  'InputText',
  'Knob',
  'Listbox',
  'MegaMenu',
  'Menu',
  'Menubar',
  'Message',
  'MeterGroup',
  'MultiSelect',
  'OrderList',
  'OrganizationChart',
  'OverlayPanel',
  'Paginator',
  'Panel',
  'PanelMenu',
  'Password',
  'PickList',
  'ProgressBar',
  'ProgressSpinner',
  'RadioButton',
  'Rating',
  'Row',
  'ScrollPanel',
  'ScrollTop',
  'SelectButton',
  'Sidebar',
  'Skeleton',
  'Slider',
  'SpeedDial',
  'SplitButton',
  'Splitter',
  'SplitterPanel',
  'Stepper',
  'StepperPanel',
  'Steps',
  'TabMenu',
  'TabPanel',
  'TabView',
  'Tag',
  'Terminal',
  'TerminalService',
  'Textarea',
  'TieredMenu',
  'Timeline',
  'Timelist',
  // 'Toast',
  // Toast must be registered globally in order for the toast service to work properly
  'ToggleButton',
  'Toolbar',
  // 'Tooltip',
  // Tooltip must be registered globally in order for the tooltip service to work properly
  'Tree',
  'TreeSelect',
  'TreeTable',
  'TriStateCheckbox',
  'VirtualScroller',
]

export interface PrimeVueResolverOptions {
  /**
   * import style along with components
   *
   * @default true
   */
  importStyle?: boolean
  /**
   * import `primeicons' icons
   *
   * requires package `primeicons`
   *
   * @default true
   */
  importIcons?: boolean
  /**
   * imports a free theme - set theme name here (e.g. saga-blue)
   *
   * @default ''
   */
  importTheme?: string
  /**
   * prefix for components (e.g. 'P' to resolve Menu from PMenu)
   *
   * @default ''
   */
  prefix?: string
}

/**
 * Resolver for PrimeVue - If you're using a component with the same tag as an native HTML element (e.g. button) the component must be in uppercase
 *
 * @link https://github.com/primefaces/primevue
 */
export function PrimeVueResolver(options: PrimeVueResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const sideEffects: SideEffectsInfo = []

      if (options.importStyle)
        sideEffects.push('primevue/resources/primevue.min.css')

      if (options.importIcons)
        sideEffects.push('primeicons/primeicons.css')

      if (options.importTheme) {
        sideEffects.push(
          `primevue/resources/themes/${options.importTheme}/theme.css`,
        )
      }

      if (options.prefix) {
        if (!name.startsWith(options.prefix))
          return

        name = name.substring(options.prefix.length)
      }

      if (components.includes(name)) {
        return {
          from: `primevue/${name.toLowerCase()}`,
          sideEffects,
        }
      }
    },
  }
}
