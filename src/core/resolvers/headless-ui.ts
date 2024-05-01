import type { ComponentResolver } from '../../types'

// @keep-sorted
const components = [
  'Combobox',
  'ComboboxButton',
  'ComboboxInput',
  'ComboboxLabel',
  'ComboboxOption',
  'ComboboxOptions',
  'Dialog',
  'DialogDescription',
  'DialogOverlay',
  'DialogPanel',
  'DialogTitle',
  'Disclosure',
  'DisclosureButton',
  'DisclosurePanel',
  'FocusTrap',
  'Listbox',
  'ListboxButton',
  'ListboxLabel',
  'ListboxOption',
  'ListboxOptions',
  'Menu',
  'MenuButton',
  'MenuItem',
  'MenuItems',
  'Popover',
  'PopoverButton',
  'PopoverGroup',
  'PopoverOverlay',
  'PopoverPanel',
  'Portal',
  'PortalGroup',
  'RadioGroup',
  'RadioGroupDescription',
  'RadioGroupLabel',
  'RadioGroupOption',
  'Switch',
  'SwitchDescription',
  'SwitchGroup',
  'SwitchLabel',
  'Tab',
  'TabGroup',
  'TabList',
  'TabPanel',
  'TabPanels',
  'TransitionChild',
  'TransitionRoot',
]

export interface HeadlessUiResolverOptions {
  /**
   * prefix for headless ui components used in templates
   *
   * @default ""
   */
  prefix?: string
}

/**
 * Resolver for headlessui
 *
 * @link https://github.com/tailwindlabs/headlessui
 */
export function HeadlessUiResolver(options: HeadlessUiResolverOptions = {}): ComponentResolver {
  const { prefix = '' } = options
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith(prefix)) {
        const componentName = name.substring(prefix.length)
        if (components.includes(componentName)) {
          return {
            name: componentName,
            from: '@headlessui/vue',
          }
        }
      }
    },
  }
}
