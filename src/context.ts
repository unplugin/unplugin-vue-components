import { relative } from 'path'
import Debug from 'debug'
import { ResolvedConfig } from 'vite'
import { ComponentInfo, ResolvedOptions } from './types'
import { pascalCase, toArray, getNameFromFilePath, resolveAlias } from './utils'
import { searchComponents } from './fs/glob'

const debug = {
  components: Debug('vite-plugin-components:context:components'),
}

export class Context {
  viteConfig: ResolvedConfig | undefined
  readonly globs: string[]

  private _componentPaths = new Set<string>()
  private _componentNameMap: Record<string, ComponentInfo> = {}

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

  private _searched = 0

  /**
   * This search for components in with the given options.
   * Will be called multiple times to ensure file loaded,
   * should normally run only once.
   *
   * @param ctx
   * @param force
   */
  searchGlob(forceMs = -1) {
    if (this._searched && forceMs < 0)
      return

    const now = +new Date()
    if (now - this._searched > forceMs) {
      searchComponents(this)
      this._searched = now
    }
  }
}
