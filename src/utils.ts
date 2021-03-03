import { join, parse, resolve } from 'path'
import minimatch from 'minimatch'
import { ResolvedConfig } from 'vite'
import { ComponentInfo, ResolvedOptions, Options, ImportInfo } from './types'
import { LibraryResolver } from './helpers/libraryResolver'
import { defaultOptions } from './constants'
import { Context } from './context'

export interface ResolveComponent {
  filename: string
  namespace?: string
}

export function slash(str: string) {
  return str.replace(/\\/g, '/')
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
    if (minimatch(slash(filepath), glob))
      return true
  }
  return false
}

export function stringifyImport(info: ImportInfo | string) {
  if (typeof info === 'string')
    return `import '${info}'`
  if (!info.name)
    return `import '${info.path}'`
  else if (info.importName)
    return `import { ${info.importName} as ${info.name} } from '${info.path}'`
  else
    return `import ${info.name} from '${info.path}'`
}

export function stringifyComponentImport({ name, path, importName, sideEffects }: ComponentInfo, ctx: Context) {
  if (ctx.options.importPathTransform) {
    const result = ctx.options.importPathTransform(path)
    if (result != null)
      path = result
  }

  const imports = [
    stringifyImport({ name, path, importName }),
  ]

  if (sideEffects?.length)
    sideEffects.forEach(i => imports.push(stringifyImport(i)))

  return imports.join('\n')
}

export function resolveOptions(options: Options, viteConfig: ResolvedConfig): ResolvedOptions {
  const resolved = Object.assign({}, defaultOptions, options) as ResolvedOptions
  resolved.libraries = toArray(resolved.libraries).map(i => typeof i === 'string' ? { name: i } : i)
  resolved.customComponentResolvers = toArray(resolved.customComponentResolvers)
  resolved.customComponentResolvers.push(...resolved.libraries.map(lib => LibraryResolver(lib)))
  resolved.extensions = toArray(resolved.extensions)

  const extsGlob = resolved.extensions.length === 1
    ? resolved.extensions
    : `{${resolved.extensions.join(',')}}`

  resolved.dirs = toArray(resolved.dirs)
  resolved.resolvedDirs = resolved.dirs.map(i => slash(resolve(viteConfig.root, i)))

  resolved.globs = resolved.dirs.map(i =>
    resolved.deep
      ? slash(join(i, `**/*.${extsGlob}`))
      : slash(join(i, `*.${extsGlob}`)),
  )

  if (!resolved.extensions.length)
    throw new Error('[vite-plugin-components] extensions are required to search for components')

  return resolved
}

export function getNameFromFilePath(filePath: string, options: ResolvedOptions): string {
  const { resolvedDirs, directoryAsNamespace, globalNamespaces } = options

  const parsedFilePath = parse(slash(filePath))

  let strippedPath = ''

  // remove include directories from filepath
  for (const dir of resolvedDirs) {
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

export function resolveAlias(filepath: string, alias: ResolvedConfig['resolve']['alias'] = []) {
  const result = filepath
  if (Array.isArray(alias)) {
    for (const { find, replacement } of alias)
      result.replace(find, replacement)
  }
  return result
}
