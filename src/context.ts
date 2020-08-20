import { ComponentsInfo, ComponentsImportMap, Options } from './types'

export class Context {
  importMap: ComponentsImportMap = {}
  components: ComponentsInfo[] = []
  _searchingPromise?: Promise<any>

  private importMapPromises: Record<string, [(null | Promise<string[]>), (null | ((result: string[]) => void))]> = {}

  constructor(
    public readonly options: Options,
  ) {}

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
    this.importMap[key] = names
    if (this.importMapPromises[key])
      this.importMapPromises[key][1]?.(names)
  }
}
