import { parse } from 'path'
import minimatch from 'minimatch'
import resolve from 'resolve'
import { slash, toArray } from '@antfu/utils'
import {
  getPackageInfo,
  isPackageExists,
} from 'local-pkg'
import type { ComponentInfo, ImportInfo, ResolvedOptions } from '../types'
import type { Context } from './context'
import { DISABLE_COMMENT } from './constants'

export const isSSR = Boolean(process.env.SSR || process.env.SSG || process.env.VITE_SSR || process.env.VITE_SSG)

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

export function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) {
    return { path: id, query: {} }
  }
  else {
    const query = Object.fromEntries(new URLSearchParams(id.slice(index)) as any)
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

export function getTransformedPath(path: string, ctx: Context): string {
  if (ctx.options.importPathTransform) {
    const result = ctx.options.importPathTransform(path)
    if (result != null)
      path = result
  }

  return path
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
  path = getTransformedPath(path, ctx)

  const imports = [
    stringifyImport({ name, path, importName }),
  ]

  if (sideEffects)
    toArray(sideEffects).forEach(i => imports.push(stringifyImport(i)))

  return imports.join(';')
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

    return filename
  }

  return filename
}

export function resolveAlias(filepath: string, alias: any) {
  const result = filepath
  if (Array.isArray(alias)) {
    for (const { find, replacement } of alias)
      result.replace(find, replacement)
  }
  return result
}

export async function getPkgVersion(pkgName: string, defaultVersion: string): Promise<string> {
  try {
    const isExist = isPackageExists(pkgName)
    if (isExist) {
      const pkg = await getPackageInfo(pkgName)
      return pkg?.version ?? defaultVersion
    }
    else {
      return defaultVersion
    }
  }
  catch (err) {
    console.error(err)
    return defaultVersion
  }
}

export function shouldTransform(code: string) {
  if (code.includes(DISABLE_COMMENT))
    return false
  return true
}

export function resolveImportPath(importName: string): string | undefined {
  return resolve.sync(importName, {
    preserveSymlinks: false,
  })
}
