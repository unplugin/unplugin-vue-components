import { Options } from './types'

export const MODULE_NAME = 'vite-plugin-components'
export const RESOLVER_EXT = '.vite-plugin-components'
export const DISABLE_COMMENT = '/* vite-plugin-components disabled */'

export const defaultOptions: Required<Options> = {
  dirs: 'src/components',
  extensions: 'vue',
  transformer: 'vue3',
  deep: true,

  directoryAsNamespace: false,
  globalNamespaces: [],

  libraries: [],

  customLoaderMatcher: () => false,
  customComponentResolvers: [],

  importPathTransform: v => v,
}
