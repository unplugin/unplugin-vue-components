import { ComponentResolver } from '../../types'

const components = [
  'Dialog',
  'DialogDescription',
  'DialogOverlay',
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
  'TransitionChild',
  'TransitionRoot',
  'TabGroup',
  'TabList',
  'Tab',
  'TabPanels',
  'TabPanel',
]

/**
 * Resolver for headlessui
 *
 * @link https://github.com/tailwindlabs/headlessui
 */
export function HeadlessUiResolver(): ComponentResolver {
  return (name: string) => {
    if (components.includes(name))
      return { importName: name, path: '@headlessui/vue' }
  }
}
