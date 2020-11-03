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
   * Directory names that are ignored as Component names.
   * Only works if Foldernames are allowed
   * @default "['global', 'partials']"
   */
  globalNamespaces: string[]

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
   * Allow directories as Names for components
   * @default false
   */

  folderNamespace: boolean

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
}

export interface ComponentsInfo {
  name: string
  path: string
}

export type ComponentsImportMap = Record<string, string[] | undefined>
