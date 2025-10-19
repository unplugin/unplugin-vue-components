import type { ComponentResolver, ComponentResolveResult } from '../../types'
import { kebabCase } from '../utils'

export interface VarletUIResolverOptions {
  /**
   * support vue version
   * vue3 use @varlet/ui, vue2 use @varlet-vue2/ui
   *
   * @default 'vue3'
   */
  version?: 'vue3' | 'vue2'

  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * style entry file extname
   *
   * @default '.mjs'
   */
  styleExtname?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * compatible with unplugin-auto-import
   *
   * @default false
   */
  autoImport?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean

  /**
   * @deprecated use `importStyle: 'less'` instead
   */
  importLess?: boolean
}

const varFunctions = ['ImagePreview', 'Snackbar', 'Picker', 'ActionSheet', 'Dialog', 'Locale', 'StyleProvider', 'LoadingBar']
const varDirectives = ['Ripple', 'Lazy', 'Hover']

export function getResolved(name: string, options: VarletUIResolverOptions): ComponentResolveResult {
  const {
    importStyle = 'css',
    importCss = true,
    importLess,
    styleExtname = '.mjs',
    autoImport = false,
    version = 'vue3',
  } = options

  const path = version === 'vue2' ? '@varlet-vue2/ui' : '@varlet/ui'
  const sideEffects = []

  if (importStyle || importCss) {
    if (importStyle === 'less' || importLess)
      sideEffects.push(`${path}/es/${kebabCase(name)}/style/less`)
    else
      sideEffects.push(`${path}/es/${kebabCase(name)}/style/index${styleExtname}`)
  }

  return {
    from: path,
    name: autoImport ? name : `_${name}Component`,
    sideEffects,
  }
}

/**
 * Resolver for VarletUI
 *
 * @link https://github.com/varletjs/varlet
 * @link https://github.com/varletjs/varlet-vue2
 */
export function VarletUIResolver(options: VarletUIResolverOptions = {}): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        const { autoImport = false } = options

        if (autoImport && varFunctions.includes(name))
          return getResolved(name, options)

        if (name.startsWith('Var'))
          return getResolved(name.slice(3), options)
      },
    },
    {
      type: 'directive',
      resolve: (name: string) => {
        const { directives = true } = options

        if (!directives)
          return

        if (!varDirectives.includes(name))
          return

        return getResolved(name, options)
      },
    },
  ]
}
