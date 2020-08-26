import path from 'path'
// @ts-ignore
import minimatch from 'minimatch'

export function normalize(str: string) {
  return capitalize(camelize(str))
}

export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function toArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr))
    return arr
  return [arr]
}

export function matchGlobs(filepath: string, globs: string[]) {
  for (const glob of globs) {
    if (minimatch(filepath, glob))
      return true
  }
  return false
}

export function getNameFromFilePath(filePath: string): string {
  const parsedFilePath = path.parse(filePath)
  if (parsedFilePath.name === 'index') {
    const filePathSegments = filePath.split(path.sep)
    const parentDirName = filePathSegments[filePathSegments.length - 2]
    if (parentDirName)
      return parentDirName
  }
  return parsedFilePath.name
}

export function resolveAlias(filepath: string, alias: Record<string, string>) {
  let result = filepath
  Object.entries(alias).forEach(([k, p]) => {
    if (k.startsWith('/') && k.endsWith('/') && result.startsWith(k))
      result = path.join(p, result.replace(k, ''))
  })
  return result
}
