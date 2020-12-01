import { Transform } from 'vite'

/**
 * Plugin options.
 */
export interface Options {
  /**
   * Relative paths to the directory to search for components.
   * @default 'src/components'
   */
  dirs: string | string[]

  /**
   * Valid file extensions for components.
   * @default ['vue']
   */
  extensions: string | string[]

  /**
   * Search for subdirectories
   * @default true
   */
  deep: boolean

  /**
   * Allow subdirectories as namespace prefix for components
   * @default false
   */
  directoryAsNamespace: boolean

  /**
   * Subdirectory paths for ignoring namespace prefixes
   * works when `directoryAsNamespace: true`
   * @default "[]"
   */
  globalNamespaces: string[]

  /**
   * Path alias, same as what you passed to vite root config
   * @default {}
   */
  alias: Record<string, string>

  /**
   * Root path of Vite project.
   * @default 'process.cwd()'
   */
  root: string

  /**
   * Auto-import for custom loader (md, svg, etc.). Returns true to enable for certain files.
   *
   * @default ()=>false
   */
  customLoaderMatcher: Transform['test']
}

export interface ComponentsInfo {
  name: string
  path: string
}

export type ComponentsImportMap = Record<string, string[] | undefined>
