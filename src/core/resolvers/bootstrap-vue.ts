import type { ComponentResolver } from '../../types'

export interface BootstrapVueResolverOptions {
  /**
   * Auto import for directives.
   *
   * @default true
   */
  directives?: boolean
}

const COMPONENT_ALIASES: Record<string, string> = {
  BBtn: 'BButton',
  BBtnClose: 'BButtonClose',
  BBtnGroup: 'BButtonGroup',
  BBtnToolbar: 'BButtonToolbar',
  BCheck: 'BFormCheckbox',
  BCheckbox: 'BFormCheckbox',
  BCheckboxGroup: 'BFormCheckboxGroup',
  BCheckGroup: 'BFormCheckboxGroup',
  BDatalist: 'BFormDatalist',
  BDd: 'BDropdown',
  BDdDivider: 'BDropdownDivider',
  BDdForm: 'BDropdownForm',
  BDdGroup: 'BDropdownGroup',
  BDdHeader: 'BDropdownHeader',
  BDdItem: 'BDropdownItem',
  BDdItemButton: 'BDropdownItemButton',
  BDdItemBtn: 'BDropdownItemButton',
  BDdText: 'BDropdownText',
  BDropdownItemBtn: 'BDropdownItemButton',
  BFile: 'BFormFile',
  BFormDatepicker: 'BDatepicker',
  BInput: 'BFormInput',
  BNavDd: 'BNavItemDropdown',
  BNavDropdown: 'BNavItemDropdown',
  BNavItemDd: 'BNavItemDropdown',
  BNavToggle: 'BNavbarToggle',
  BRadio: 'BFormRadio',
  BRadioGroup: 'BFormRadioGroup',
  BRating: 'BFormRating',
  BSelect: 'BFormSelect',
  BSelectOption: 'BFormSelectOption',
  BSelectOptionGroup: 'BFormSelectOptionGroup',
  BSpinbutton: 'BFormSpinbutton',
  BTag: 'BFormTag',
  BTags: 'BFormTags',
  BTextarea: 'BFormTextarea',
  BTimepicker: 'BFormTimepicker',
}

/**
 * Resolver for BootstrapVue
 *
 * @link https://github.com/bootstrap-vue/bootstrap-vue
 */
export function BootstrapVueResolver(_options: BootstrapVueResolverOptions = {}): ComponentResolver[] {
  const options = { directives: true, ..._options }
  const resolvers: ComponentResolver[] = [{
    type: 'component',
    resolve: (name) => {
      if (name.match(/^B[A-Z]/)) {
        return {
          name: COMPONENT_ALIASES[name] || name,
          from: 'bootstrap-vue',
        }
      }
    },
  }]

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name) => {
        if (options.directives && name.match(/^B[A-Z]/)) {
          return {
            name: `V${name}`,
            from: 'bootstrap-vue',
          }
        }
      },
    })
  }

  return resolvers
}
