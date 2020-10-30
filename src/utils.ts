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

export function split(str: string, sep: string) {
    return str == '' ? [] : str.split(sep)
}

export function join(arr: string[], sep: string) {
	return arr == null ? '' : Array.prototype.join.call(arr, sep)
}

export function isEmpty(value: any) {
  if (!value || value === null || value === undefined || (Array.isArray(value) && Object.keys(value).length <= 0)) {
    return true
  } else {
    return false
  }
}

export function matchGlobs(filepath: string, globs: string[]) {
  for (const glob of globs) {
    if (minimatch(filepath, glob))
      return true
  }
  return false
}

export function getNameFromFilePath(filePath: string, includedFrom: string | string[], allowFolderNames: boolean, namespaces: string[]): string {
  const parsedFilePath = path.parse(filePath)

  let strippedPath = ''

  // remove include directories from filepath

  if(Array.isArray(includedFrom)) {
    includedFrom.forEach((inc: string) => {
      if(parsedFilePath.dir.includes(inc)) {
        strippedPath = parsedFilePath.dir.replace(inc, '')
      }
    })
  } else {
    strippedPath = parsedFilePath.dir.replace(includedFrom, '')
  }

  let folders = split(strippedPath.slice(1), "/")
  let filename = parsedFilePath.name

  // set parent directory as filename if it is index 
  if(filename === 'index') {
    filename = `${folders.slice(-1)[0]}`
    return filename
  }

  if (allowFolderNames) {
    // remove namesspaces from folder names
    if (namespaces.some((name: string) => folders.includes(name))) {
      folders = folders.filter((f) => !namespaces.includes(f))
    }

    if(!isEmpty(folders)) {
      // add folders to filename
      filename = `${join(folders, '')}${filename}`
    }
    
    return filename;
  }

  return filename
}



export function resolveAlias(filepath: string, alias: Record<string, string>) {
  let result = filepath
  Object.entries(alias).forEach(([k, p]) => {
    if (k.startsWith('/') && k.endsWith('/') && result.startsWith(k))
      result = path.join(p, result.replace(k, ''))
  })
  return result
}
