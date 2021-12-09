import { relative } from 'path'
import fs from 'fs'
import Debug from 'debug'
import { UpdatePayload, ViteDevServer } from 'vite'
import { throttle, toArray, slash } from '@antfu/utils'
import { Options, ComponentInfo, ResolvedOptions, Transformer } from '../types'
import { pascalCase, getNameFromFilePath, resolveAlias, matchGlobs, parseId } from './utils'
import { resolveOptions } from './options'
import { searchComponents } from './fs/glob'
import { generateDeclaration } from './declaration'
import { generateIdeHelper } from './ideHelper'
import transformer from './transformer'

const debug = {
  components: Debug('unplugin-vue-components:context:components'),
  search: Debug('unplugin-vue-components:context:search'),
  hmr: Debug('unplugin-vue-components:context:hmr'),
  decleration: Debug('unplugin-vue-components:decleration'),
  ideHelper: Debug('unplugin-vue-components:ideHelper'),
  env: Debug('unplugin-vue-components:env'),
}

export class Context {
  options: ResolvedOptions
  transformer: Transformer = undefined!

  private _componentPaths = new Set<string>()
  private _componentNameMap: Record<string, ComponentInfo> = {}
  private _componentUsageMap: Record<string, Set<string>> = {}
  private _componentCustomMap: Record<string, ComponentInfo> = {}
  private _server: ViteDevServer | undefined

  root = process.cwd()
  sourcemap: string | boolean = true
  alias: Record<string, string> = {}

  constructor(
    private rawOptions: Options,
  ) {
    this.options = resolveOptions(rawOptions, this.root)
    this.generateDeclaration = throttle(500, false, this.generateDeclaration.bind(this))
    this.generateIdeHelper = throttle(500, false, this.generateIdeHelper.bind(this))
    this.setTransformer(this.options.transformer)
  }

  setRoot(root: string) {
    if (this.root === root)
      return
    debug.env('root', root)
    this.root = root
    this.options = resolveOptions(this.rawOptions, this.root)
  }

  setTransformer(name: Options['transformer']) {
    debug.env('transformer', name)
    this.transformer = transformer(this, name || 'vue3')
  }

  transform(code: string, id: string) {
    const { path, query } = parseId(id)
    return this.transformer(code, id, path, query)
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: fs.FSWatcher) {
    const { globs } = this.options

    watcher
      .on('unlink', (path) => {
        if (!matchGlobs(path, globs))
          return
        this.removeComponents(path)
        this.onUpdate(path)
      })
    watcher
      .on('add', (path) => {
        if (!matchGlobs(path, globs))
          return
        this.addComponents(path)
        this.onUpdate(path)
      })
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

  addCustomComponents(info: ComponentInfo) {
    if (info.name)
      this._componentCustomMap[info.name] = info
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
    this.generateDeclaration()
    this.generateIdeHelper()

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
          const r = `/${slash(relative(this.root, key))}`
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
        if (this._componentNameMap[name] && !this.options.allowOverrides) {
          // eslint-disable-next-line no-console
          console.warn(`[unplugin-vue-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`)
          return
        }

        this._componentNameMap[name] = {
          name,
          path,
        }
      })
  }

  async findComponent(name: string, type: 'component' | 'directive', excludePaths: string[] = []): Promise<ComponentInfo | undefined> {
    // resolve from fs
    let info = this._componentNameMap[name]
    if (info && !excludePaths.includes(info.path) && !excludePaths.includes(info.path.slice(1)))
      return info

    // custom resolvers
    for (const resolver of this.options.resolvers) {
      if (resolver.type !== type)
        continue

      const result = await resolver.resolve(name)
      if (result) {
        if (typeof result === 'string') {
          info = {
            name,
            path: result,
          }
          this.addCustomComponents(info)
          return info
        }
        else {
          info = {
            name,
            ...result,
          }
          this.addCustomComponents(info)
          return info
        }
      }
    }

    return undefined
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

  generateDeclaration() {
    if (!this.options.dts)
      return

    debug.decleration('generating')
    generateDeclaration(this, this.options.root, this.options.dts)
  }

  generateIdeHelper() {
    if (!this.options.generateIdeHelper)
      return

    debug.ideHelper('generating')
    generateIdeHelper(this, this.options.root, this.options.generateIdeHelper)
  }

  get componentNameMap() {
    return this._componentNameMap
  }

  get componentCustomMap() {
    return this._componentCustomMap
  }
}
