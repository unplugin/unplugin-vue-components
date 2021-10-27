import fs from 'fs'
import { dirname, join } from 'path'
import Debug from 'debug'
import { ComponentResolver, UILibraryOptions } from '../../types'
import { camelCase, kebabCase, resolveImportPath } from '../utils'

const debug = Debug('unplugin-vue-components:helper:library')

export function tryLoadVeturTags(name: string): string[] | undefined {
  try {
    // eslint-disable-next-line no-eval
    const pkgPath = resolveImportPath(`${name}/package.json`)
    if (!pkgPath)
      return
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const tagsPath = pkg?.vetur?.tags
    if (!tagsPath)
      return

    const tags = JSON.parse(fs.readFileSync(join(dirname(pkgPath), tagsPath), 'utf-8'))
    return Object.keys(tags).map(i => camelCase(i))
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

export function LibraryResolver(options: UILibraryOptions): ComponentResolver {
  const {
    name: libraryName,
    entries = tryLoadVeturTags(options.name),
    prefix = '',
  } = options

  if (!entries) {
    // eslint-disable-next-line no-console
    console.warn(`[unplugin-vue-components] Failed to load Vetur tags from library "${libraryName}"`)
    return () => {}
  }

  debug(entries)

  const prefixKebab = kebabCase(prefix)
  const kebabEntries = entries.map(name => ({ name, kebab: kebabCase(name) }))

  return (name) => {
    const kebab = kebabCase(name)
    let componentName = kebab

    if (prefixKebab) {
      if (!kebab.startsWith(`${prefixKebab}-`))
        return
      componentName = kebab.slice(prefixKebab.length + 1)
    }

    for (const entry of kebabEntries) {
      if (entry.kebab === componentName)
        return { path: libraryName, importName: entry.name }
    }
  }
}
