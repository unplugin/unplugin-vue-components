import { Transform } from 'vite'

export type ComponentResolveResult = string | { path: string; importName?: string }

export type ComponentResolver = (name: string) => ComponentResolveResult | null | undefined | void

export interface UILibraryOptions {
  name: string
  prefix?: string
  entries?: string[]
}

/**
 * Plugin options.
 */
export interface Options {
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
   * Path alias, same as what you passed to vite root config
   * @default {}
   */
  alias?: Record<string, string>

  /**
   * Root path of Vite project.
   * @default 'process.cwd()'
   */
  root?: string

  /**
   * comp libraries to use auto import
   */
  libraries?: (string | UILibraryOptions)[]

  /**
   * Auto-import for custom loader (md, svg, etc.). Returns true to enable for certain files.
   *
   * @default ()=>false
   */
  customLoaderMatcher?: Transform['test']

  /**
   * Pass a custom function to resolve the component importing path from the component name.
   *
   * The component names are always in PascalCase
   */
  customComponentResolvers?: ComponentResolver | ComponentResolver[]
}

export type ResolvedOptions = Omit<Required<Options>, 'customComponentResolvers'|'libraries'> & {
  customComponentResolvers: ComponentResolver[]
  libraries: UILibraryOptions[]
}

export interface ComponentInfo {
  name: string
  path: string
  importName?: string
}

export type ComponentsImportMap = Record<string, string[] | undefined>
