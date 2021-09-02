import { ComponentResolver, SideEffectsInfo } from '../../types'

const components = [
  'AutoComplete',
  'Calendar',
  'CascadeSelect',
  'Checkbox',
  'Chips',
  'ColorPicker',
  'Dropdown',
  'Editor',
  'InputMask',
  'InputNumber',
  'InputSwitch',
  'InputText',
  'Knob',
  'Listbox',
  'MultiSelect',
  'Password',
  'RadioButton',
  'Rating',
  'SelectButton',
  'Slider',
  'Textarea',
  'ToggleButton',
  'TreeSelect',
  'TriStateCheckbox',
  'Button',
  'SpeedDial',
  'SplitButton',
  'DataTable',
  'Column',
  'ColumnGroup',
  'DataView',
  'VirtualScroller',
  'FullCalendar',
  'OrderList',
  'OrganizationChart',
  'Paginator',
  'PickList',
  'Timelist',
  'Tree',
  'TreeTable',
  'Accordion',
  'AccordionTab',
  'Card',
  'DeferredContent',
  'Divider',
  'Fieldset',
  'Panel',
  'Splitter',
  'SplitterPanel',
  'ScrollPanel',
  'TabView',
  'TabPanel',
  'Toolbar',
  'ConfirmDialog',
  'ConfirmPopup',
  'Dialog',
  'OverlayPanel',
  'Sidebar',
  'Tooltip',
  'FileUpload',
  'Breadcrumb',
  'ContextMenu',
  'MegaMenu',
  'Menu',
  'Menubar',
  'PanelMenu',
  'Steps',
  'TabMenu',
  'TieredMenu',
  'Dock',
  'Chart',
  'Message',
  'Toast',
  'Carousel',
  'Galleria',
  'Image',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'Chip',
  'BlockUI',
  'Inplace',
  'ScrollTop',
  'Skeleton',
  'ProgressBar',
  'ProgressSpiner',
  'Tag',
  'Terminal',
  'TerminalService',
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
}

/**
 * Resolver for PrimeVue - If you're using a component with the same tag as an native HTML element (e.g. button) the component must be in uppercase
 *
 * @link https://github.com/primefaces/primevue
 */
export function PrimeVueResolver(options: PrimeVueResolverOptions = {}): ComponentResolver {
  return (name: string) => {
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

    if (components.includes(name)) {
      return {
        path: `primevue/${name}/${name}.vue`,
        sideEffects,
      }
    }
  }
}
