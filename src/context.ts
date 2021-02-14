import { join, relative, resolve } from 'path'
import Debug from 'debug'
import chokidar from 'chokidar'
import { ResolvedConfig, UpdatePayload, ViteDevServer } from 'vite'
import { Options, ComponentInfo, ResolvedOptions } from './types'
import { pascalCase, toArray, getNameFromFilePath, resolveAlias, resolveOptions, matchGlobs, slash } from './utils'
import { searchComponents } from './fs/glob'

const debug = {
  components: Debug('vite-plugin-components:context:components'),
  search: Debug('vite-plugin-components:context:search'),
  hmr: Debug('vite-plugin-components:context:hmr'),
}

export class Context {
  readonly options: ResolvedOptions

  private _componentPaths = new Set<string>()
  private _componentNameMap: Record<string, ComponentInfo> = {}
  private _componentUsageMap: Record<string, Set<string>> = {}
  private _server: ViteDevServer | undefined

  constructor(
    options: Options,
    public readonly viteConfig: ResolvedConfig,
  ) {
    this.options = resolveOptions(options, viteConfig)
    const { globs, dirs } = this.options

    if (viteConfig.command === 'serve') {
      // TODO: use vite's watcher instead
      chokidar.watch(dirs, { ignoreInitial: true })
        .on('unlink', (path) => {
          if (matchGlobs(path, globs)) {
            this.removeComponents(path)
            this.onUpdate(path)
          }
        })
        .on('add', (path) => {
          if (matchGlobs(path, globs)) {
            this.addComponents(path)
            this.onUpdate(path)
          }
        })
    }
  }

  get root() {
    return this.viteConfig.root
  }

  setServer(server: ViteDevServer) {
    this._server = server
  }

  /**
   * Record the usage of components
   * @param path
   * @param paths paths of used components
   */
  updateUsageMap(path: string, paths: string[]) {
    if (!this._componentUsageMap[path])
      this._componentUsageMap[path] = new Set()

    paths.forEach((p) => {
      this._componentUsageMap[path].add(p)
    })
  }

  addComponents(paths: string | string[]) {
    debug.components('add', paths)

    const size = this._componentPaths.size
    toArray(paths).forEach(p => this._componentPaths.add(p))
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap()
      return true
    }
    return false
  }

  removeComponents(paths: string | string[]) {
    debug.components('remove', paths)

    const size = this._componentPaths.size
    toArray(paths).forEach(p => this._componentPaths.delete(p))
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap()
      return true
    }
    return false
  }

  onUpdate(path: string) {
    if (!this._server)
      return

    const payload: UpdatePayload = {
      type: 'update',
      updates: [],
    }
    const timestamp = +new Date()
    const name = pascalCase(getNameFromFilePath(path, this.options))

    Object.entries(this._componentUsageMap)
      .forEach(([key, values]) => {
        if (values.has(name)) {
          const r = `/${relative(this.viteConfig.root, key)}`
          payload.updates.push({
            acceptedPath: r,
            path: r,
            timestamp,
            type: 'js-update',
          })
        }
      })

    if (payload.updates.length)
      this._server.ws.send(payload)
  }

  private updateComponentNameMap() {
    this._componentNameMap = {}

    Array
      .from(this._componentPaths)
      .forEach((path) => {
        const name = pascalCase(getNameFromFilePath(path, this.options))
        if (this._componentNameMap[name]) {
          console.warn(`[vite-plugin-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`)
          return
        }
        this._componentNameMap[name] = {
          name,
          absolute: path,
          path: `/${this.relative(path)}`,
        }
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
          return {
            name,
            path: result,
          }
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
    // @ts-expect-error backward compatibility
    return resolveAlias(path, this.viteConfig?.resolve?.alias || this.viteConfig?.alias || [])
  }

  relative(path: string) {
    if (path.startsWith('/') && !path.startsWith(this.root))
      return slash(path.slice(1))
    return slash(relative(this.root, path))
  }

  _searched = false

  /**
   * This search for components in with the given options.
   * Will be called multiple times to ensure file loaded,
   * should normally run only once.
   *
   * @param ctx
   * @param force
   */
  searchGlob() {
    if (this._searched)
      return

    searchComponents(this)
    debug.search(this._componentNameMap)
    this._searched = true
  }
}
