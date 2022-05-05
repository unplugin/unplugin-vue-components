import type { TypeImport } from '../../types'

export const TypeImportPresets: TypeImport[] = [
  {
    from: 'vue-router',
    names: [
      'RouterView',
      'RouterLink',
    ],
  },
  {
    from: 'vue-starport',
    names: [
      'Starport',
      'StarportCarrier',
    ],
  },
]
