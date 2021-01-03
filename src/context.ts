import { relative } from 'path'
import Debug from 'debug'
import { ResolvedConfig } from 'vite'
import { ComponentInfo, ComponentsImportMap, ResolvedOptions } from './types'
import { pascalCase, toArray, getNameFromFilePath, resolveAlias, kebabCase } from './utils'
import { searchComponents } from './fs/glob'

const debug = {
  components: Debug('vite-plugin-components:context:components'),
}

export class Context {
  viteConfig: ResolvedConfig | undefined
  readonly globs: string[]

  private _componentPaths = new Set<string>()
  private _componentNameMap: Record<string, ComponentInfo> = {}
  private _imports: ComponentsImportMap = {}
  private _importsResolveTasks: Record<string, [(null | Promise<string[]>), (null | ((result: string[]) => void))]> = {}

  constructor(
    public readonly options: ResolvedOptions,
  ) {
    const { extensions, dirs, deep } = options
    const exts = toArray(extensions)

    if (!exts.length)
      throw new Error('[vite-plugin-components] extensions are required to search for components')

    const extsGlob = exts.length === 1 ? exts[0] : `{${exts.join(',')}}`

    this.globs = toArray(dirs).map(i =>
      deep
        ? `${i}/**/*.${extsGlob}`
        : `${i}/*.${extsGlob}`,
    )

    this.searchGlob()
  }

  get root() {
    return this.viteConfig?.root || process.cwd()
  }

  addComponents(paths: string | string[]) {
    const size = this._componentPaths.size
    toArray(paths).forEach(p => this._componentPaths.add(p))
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap()
      return true
    }
    return false
  }

  removeComponents(paths: string | string[]) {
    const size = this._componentPaths.size
    toArray(paths).forEach(p => this._componentPaths.delete(p))
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap()
      return true
    }
    return false
  }

  findReferencesOfComponentName(name: string) {
    return Object.entries(this._imports)
      .map(([path, components]) => components?.includes(name) ? path : undefined)
      .filter(Boolean) as string[]
  }

  private updateComponentNameMap() {
    this._componentNameMap = {}

    debug.components(this._componentPaths)

    Array
      .from(this._componentPaths)
      .forEach((path) => {
        const name = pascalCase(getNameFromFilePath(path, this.options))
        if (this._componentNameMap[name]) {
          console.warn(`[vite-plugin-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`)
          return
        }
        this._componentNameMap[name] = { name, path: `/${path}` }
      })
  }

  findComponent(name: string, excludePaths: string[] = []): ComponentInfo | undefined {
    // resolve from fs
    const info = this._componentNameMap[name]
    if (info && !excludePaths.includes(info.path) && !excludePaths.includes(info.path.slice(1)))
      return info

    // custom resolvers
    for (const resolver of this.options.customComponentResolvers) {
      const result = resolver(name)
      if (result) {
        if (typeof result === 'string') {
          return { name, path: result }
        }
        else {
          return {
            name,
            path: result.path,
            importName: result.importName,
          }
        }
      }
    }

    return undefined
  }

  findComponents(names: string[], excludePaths: string[] = []) {
    return names
      .map(name => this.findComponent(name, excludePaths))
      .filter(Boolean) as ComponentInfo[]
  }

  normalizePath(path: string) {
    return this.relative(this.resolveAlias(path))
  }

  resolveAlias(path: string) {
    return resolveAlias(path, this.viteConfig?.alias || {})
  }

  relative(path: string) {
    if (path.startsWith('/') && !path.startsWith(this.root))
      return path.slice(1).replace(/\\/g, '/')
    return relative(this.root, path).replace(/\\/g, '/')
  }

  setImports(key: string, names: string[]) {
    const casedNames = names.map(name => pascalCase(name))
    this._imports[key] = casedNames
    if (this._importsResolveTasks[key])
      this._importsResolveTasks[key][1]?.(casedNames)
    return key
  }

  /**
   * Await for imports to get resolved
   *
   * @param ctx
   * @param force
   */
  async getImports(key: string) {
    if (this._imports[key])
      return this._imports[key]

    if (!this._importsResolveTasks[key]) {
      this._importsResolveTasks[key] = [null, null]
      const p = new Promise<string[]>((resolve) => {
        this._importsResolveTasks[key][1] = resolve
      })
      this._importsResolveTasks[key][0] = p
    }

    return await Promise.resolve(this._importsResolveTasks[key][0])
  }

  private _searchGlob: Promise<void> | undefined

  /**
   * This search for components in with the given options.
   * Will be called multiple times to ensure file loaded,
   * should normally run only once.
   *
   * @param ctx
   * @param force
   */
  async searchGlob() {
    if (!this._searchGlob) {
      this._searchGlob = (async() => {
        await searchComponents(this)
      })()
    }

    return await this._searchGlob
  }
}
