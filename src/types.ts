import type { FilterPattern } from '@rollup/pluginutils'
import type { TransformResult } from 'unplugin'
import type { Awaitable } from '@antfu/utils'

export interface ImportInfo {
  name?: string
  importName?: string
  path: string
}

export type SideEffectsInfo = (ImportInfo | string)[] | ImportInfo | string | undefined

export interface ComponentInfo extends ImportInfo {
  sideEffects?: SideEffectsInfo
}

export type ComponentResolveResult = Awaitable<string | ComponentInfo | null | undefined | void>

export type ComponentResolverFunction = (name: string) => ComponentResolveResult
export interface ComponentResolverObject {
  type: 'component' | 'directive'
  resolve: ComponentResolverFunction
}
export type ComponentResolver = ComponentResolverFunction | ComponentResolverObject

export type Matcher = (id: string) => boolean | null | undefined

export type Transformer = (code: string, id: string, path: string, query: Record<string, string>) => Awaitable<TransformResult | null>

export type SupportedTransformer = 'vue3' | 'vue2'

export interface PublicPluginAPI {
  /**
   * Resolves a component using the configured resolvers.
   */
  findComponent: (name: string, filename?: string) => Promise<ComponentInfo | undefined>
  /**
   * Obtain an import statement for a resolved component.
   */
  stringifyImport: (info: ComponentInfo) => string
}

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
   *
   * When specified, the `dirs` and `extensions` options will be ignored.
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
   * Pass a custom function to resolve the component importing path from the component name.
   *
   * The component names are always in PascalCase
   */
  resolvers?: (ComponentResolver | ComponentResolver[])[]

  /**
   * Apply custom transform over the path for importing
   */
  importPathTransform?: (path: string) => string | undefined

  /**
   * Transformer to apply
   *
   * @default 'vue3'
   */
  transformer?: SupportedTransformer

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

  /**
   * auto import for directives.
   *
   * default: `true` for Vue 3, `false` for Vue 2
   *
   * Babel is needed to do the transformation for Vue 2, it's disabled by default for performance concerns.
   * To install Babel, run: `npm install -D @babel/parser @babel/traverse`
   * @default undefined
   */
  directives?: boolean
}

export type ResolvedOptions = Omit<
Required<Options>,
'resolvers'|'extensions'|'dirs'|'globalComponentsDeclaration'
> & {
  resolvers: ComponentResolverObject[]
  extensions: string[]
  dirs: string[]
  resolvedDirs: string[]
  globs: string[]
  dts: string | false
  root: string
}

export type ComponentsImportMap = Record<string, string[] | undefined>
