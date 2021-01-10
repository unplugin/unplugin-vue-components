import path from 'path'
import minimatch from 'minimatch'
import { ResolvedConfig } from 'vite'
import { ComponentInfo, ResolvedOptions, Options } from './types'
import { LibraryResolver } from './helpers/libraryResolver'

export interface ResolveComponent {
  filename: string
  namespace?: string
}

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}

export function camelCase(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function toArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr))
    return arr
  return [arr]
}

export function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) {
    return { path: id, query: {} }
  }
  else {
    // @ts-ignore
    const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
    return {
      path: id.slice(0, index),
      query,
    }
  }
}

export function isEmpty(value: any) {
  if (!value || value === null || value === undefined || (Array.isArray(value) && Object.keys(value).length <= 0))
    return true

  else
    return false
}

export function matchGlobs(filepath: string, globs: string[]) {
  for (const glob of globs) {
    if (minimatch(filepath, glob))
      return true
  }
  return false
}

export function stringifyComponentImport({ name, path, importName }: ComponentInfo) {
  if (importName)
    return `import { ${importName} as ${name} } from '${path}'`
  else
    return `import ${name} from '${path}'`
}

export function resolveOptions(options: Options, defaultOptions: Required<Options>): ResolvedOptions {
  const resolvedOptions = Object.assign({}, defaultOptions, options) as ResolvedOptions
  resolvedOptions.libraries = toArray(resolvedOptions.libraries).map(i => typeof i === 'string' ? { name: i } : i)
  resolvedOptions.customComponentResolvers = toArray(resolvedOptions.customComponentResolvers)
  resolvedOptions.customComponentResolvers.push(...resolvedOptions.libraries.map(lib => LibraryResolver(lib)))

  return resolvedOptions
}

export function getNameFromFilePath(filePath: string, options: ResolvedOptions): string {
  const { dirs, directoryAsNamespace, globalNamespaces } = options

  const parsedFilePath = path.parse(filePath)

  let strippedPath = ''

  // remove include directories from filepath
  for (const dir of toArray(dirs)) {
    if (parsedFilePath.dir.startsWith(dir)) {
      strippedPath = parsedFilePath.dir.slice(dir.length)
      break
    }
  }

  let folders = strippedPath.slice(1).split('/').filter(Boolean)
  let filename = parsedFilePath.name

  // set parent directory as filename if it is index
  if (filename === 'index' && !directoryAsNamespace) {
    filename = `${folders.slice(-1)[0]}`
    return filename
  }

  if (directoryAsNamespace) {
    // remove namesspaces from folder names
    if (globalNamespaces.some((name: string) => folders.includes(name)))
      folders = folders.filter(f => !globalNamespaces.includes(f))

    if (filename.toLowerCase() === 'index')
      filename = ''

    if (!isEmpty(folders)) {
      // add folders to filename
      filename = [...folders, filename].filter(Boolean).join('-')
    }

    // console.log('!!!', filename)
    return filename
  }

  return filename
}

export function resolveAlias(filepath: string, alias: ResolvedConfig['alias'] = []) {
  let result = filepath
  if (Array.isArray(alias)) {
    for (const { find, replacement } of alias)
      result.replace(find, replacement)
  }
  return result
}
