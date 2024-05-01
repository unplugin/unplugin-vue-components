import type { ComponentResolver } from '../../types'

export interface BootstrapVueResolverOptions {
  /**
   * Auto import for directives.
   *
   * @default true
   */
  directives?: boolean
}

// @keep-sorted
const COMPONENT_ALIASES: Record<string, string> = {
  BBtn: 'BButton',
  BBtnClose: 'BButtonClose',
  BBtnGroup: 'BButtonGroup',
  BBtnToolbar: 'BButtonToolbar',
  BCheck: 'BFormCheckbox',
  BCheckGroup: 'BFormCheckboxGroup',
  BCheckbox: 'BFormCheckbox',
  BCheckboxGroup: 'BFormCheckboxGroup',
  BDatalist: 'BFormDatalist',
  BDatepicker: 'BFormDatepicker',
  BDd: 'BDropdown',
  BDdDivider: 'BDropdownDivider',
  BDdForm: 'BDropdownForm',
  BDdGroup: 'BDropdownGroup',
  BDdHeader: 'BDropdownHeader',
  BDdItem: 'BDropdownItem',
  BDdItemBtn: 'BDropdownItemButton',
  BDdItemButton: 'BDropdownItemButton',
  BDdText: 'BDropdownText',
  BDropdownItemBtn: 'BDropdownItemButton',
  BFile: 'BFormFile',
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
        if (name.match(/^B[A-Z]/)) {
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

/**
 * Resolver for BootstrapVueNext
 *
 * @link https://github.com/bootstrap-vue/bootstrap-vue-next
 */
export function BootstrapVueNextResolver(_options: BootstrapVueResolverOptions = {}): Array<ComponentResolver> {
  const options = { directives: true, ..._options }
  const resolvers: Array<ComponentResolver> = [{
    type: 'component',
    resolve: (name) => {
      if (name.match(/^B[A-Z]/))
        return { name, from: 'bootstrap-vue-next' }
    },
  }]

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name) => {
        if (name.match(/^B[A-Z]/))
          return { name: `v${name}`, from: 'bootstrap-vue-next' }
      },
    })
  }

  return resolvers
}

/**
 * Resolver for legacy BootstrapVue3 apps
 *
 * @deprecated use BootstrapVueNextResolver with https://github.com/bootstrap-vue/bootstrap-vue-next
 * @link https://www.npmjs.com/package/bootstrap-vue-3
 */
export function BootstrapVue3Resolver(_options: BootstrapVueResolverOptions = {}): Array<ComponentResolver> {
  const options = { directives: true, ..._options }
  const resolvers: Array<ComponentResolver> = [{
    type: 'component',
    resolve: (name) => {
      if (name.match(/^B[A-Z]/))
        return { name, from: 'bootstrap-vue-3' }
    },
  }]

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name) => {
        if (name.match(/^B[A-Z]/))
          return { name: `V${name}`, from: 'bootstrap-vue-3' }
      },
    })
  }

  return resolvers
}
