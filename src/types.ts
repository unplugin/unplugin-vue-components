import type { FilterPattern } from '@rollup/pluginutils'
import type { TransformResult } from 'unplugin'

export interface ImportInfo {
  name?: string
  importName?: string
  path: string
}

export type SideEffectsInfo = (ImportInfo | string)[] | ImportInfo | string | undefined

export interface ComponentInfo extends ImportInfo {
  sideEffects?: SideEffectsInfo
}

export type ComponentResolveResult = string | ComponentInfo

export type ComponentResolver = (name: string) => ComponentResolveResult | null | undefined | void

export interface UILibraryOptions {
  name: string
  prefix?: string
  entries?: string[]
}

export type Matcher = (id: string) => boolean | null | undefined

export type Transformer = (code: string, id: string, path: string, query: Record<string, string>) => TransformResult | null | Promise<null | TransformResult>

/**
 * Plugin options.
 */
export interface Options {
  /**
   * RegExp or glob to match files to be transformed
   */
  include?: FilterPattern

  /**
   * RegExp or glob to match files to NOT be transformed
   */
  exclude?: FilterPattern

  /**
   * Relative paths to the directory to search for components.
   * @default 'src/components'
   */
  dirs?: string | string[]

  /**
   * Valid file extensions for components.
   * @default ['vue']
   */
  extensions?: string | string[]

  /**
   * Glob patterns to match file names to be detected as components.
   */
  globs?: string | string[]

  /**
   * Search for subdirectories
   * @default true
   */
  deep?: boolean

  /**
   * Allow subdirectories as namespace prefix for components
   * @default false
   */
  directoryAsNamespace?: boolean

  /**
   * Subdirectory paths for ignoring namespace prefixes
   * works when `directoryAsNamespace: true`
   * @default "[]"
   */
  globalNamespaces?: string[]

  /**
   * comp libraries to use auto import
   */
  libraries?: (string | UILibraryOptions)[]

  /**
   * Pass a custom function to resolve the component importing path from the component name.
   *
   * The component names are always in PascalCase
   */
  resolvers?: ComponentResolver | ComponentResolver[]

  /**
   * Apply custom transform over the path for importing
   */
  importPathTransform?: (path: string) => string | undefined

  /**
   * Transformer to apply
   *
   * @default 'vue3'
   */
  transformer?: 'vue3' | 'vue2'

  /**
   * Generate TypeScript declaration for global components
   *
   * Accept boolean or a path related to project root
   *
   * @see https://github.com/vuejs/vue-next/pull/3399
   * @see https://github.com/johnsoncodehk/volar#using
   * @default true
   */
  dts?: boolean | string

  /**
   * Do not emit warning on component overriding
   *
   * @default false
   */
  allowOverrides?: boolean
}

export type ResolvedOptions = Omit<
Required<Options>,
'resolvers'|'libraries'|'extensions'|'dirs'|'globalComponentsDeclaration'
> & {
  resolvers: ComponentResolver[]
  libraries: UILibraryOptions[]
  extensions: string[]
  dirs: string[]
  resolvedDirs: string[]
  globs: string[]
  dts: string | false
  root: string
}

export type ComponentsImportMap = Record<string, string[] | undefined>
