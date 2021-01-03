export type ComponentResolveResult = string | { path: string; importName?: string }

export type ComponentResolver = (name: string) => ComponentResolveResult | null | undefined | void

export interface UILibraryOptions {
  name: string
  prefix?: string
  entries?: string[]
}

export type Matcher = (id: string) => boolean | null | undefined

export type Transformer = (code: string, id: string, path: string, query: Record<string, string>) => string

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
   * comp libraries to use auto import
   */
  libraries?: (string | UILibraryOptions)[]

  /**
   * Auto-import for custom loader (md, svg, etc.). Returns true to enable for certain files.
   *
   * @default ()=>false
   */
  customLoaderMatcher?: Matcher

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
