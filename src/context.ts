import { ComponentsInfo, ComponentsImportMap, Options } from './types'

export class Context {
  importMap: ComponentsImportMap = {}
  _searchingPromise?: Promise<any>

  private _components: ComponentsInfo[] = []
  private importMapPromises: Record<string, [(null | Promise<string[]>), (null | ((result: string[]) => void))]> = {}

  constructor(
    public readonly options: Options,
  ) {}

  get components() {
    return this._components
  }

  set components(components: ComponentsInfo[]) {
    this._components = components.map(([name, path]) => [capitalize(camelize(name)), path])
  }

  async getImportMap(key: string) {
    if (this.importMap[key])
      return this.importMap[key]

    if (!this.importMapPromises[key]) {
      this.importMapPromises[key] = [null, null]
      const p = new Promise<string[]>((resolve) => {
        this.importMapPromises[key][1] = resolve
      })
      this.importMapPromises[key][0] = p
    }

    return await Promise.resolve(this.importMapPromises[key][0])
  }

  setImportMap(key: string, names: string[]) {
    const casedNames = names.map(name => capitalize(camelize(name)))
    this.importMap[key] = casedNames
    if (this.importMapPromises[key])
      this.importMapPromises[key][1]?.(casedNames)
  }
}

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
