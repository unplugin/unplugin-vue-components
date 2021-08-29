import { join, resolve } from 'path'
import { slash, toArray } from '@antfu/utils'
import hasPkg from 'has-pkg'
import { ResolvedOptions, Options } from '../types'
import { LibraryResolver } from './helpers/libraryResolver'

export const defaultOptions: Required<Options> = {
  dirs: 'src/components',
  extensions: 'vue',
  transformer: 'vue3',
  deep: true,
  dts: hasPkg('typescript'),

  directoryAsNamespace: false,
  globalNamespaces: [],

  libraries: [],

  customLoaderMatcher: () => false,
  customComponentResolvers: [],

  importPathTransform: v => v,

  allowOverrides: false,
}

export function resolveOptions(options: Options, root: string): ResolvedOptions {
  const resolved = Object.assign({}, defaultOptions, options) as ResolvedOptions
  resolved.libraries = toArray(resolved.libraries).map(i => typeof i === 'string' ? { name: i } : i)
  resolved.customComponentResolvers = toArray(resolved.customComponentResolvers)
  resolved.customComponentResolvers.push(...resolved.libraries.map(lib => LibraryResolver(lib)))
  resolved.extensions = toArray(resolved.extensions)

  const extsGlob = resolved.extensions.length === 1
    ? resolved.extensions
    : `{${resolved.extensions.join(',')}}`

  resolved.dirs = toArray(resolved.dirs)
  resolved.resolvedDirs = resolved.dirs.map(i => slash(resolve(root, i)))

  resolved.globs = resolved.resolvedDirs.map(i => resolved.deep
    ? slash(join(i, `**/*.${extsGlob}`))
    : slash(join(i, `*.${extsGlob}`)),
  )

  if (!resolved.extensions.length)
    throw new Error('[unplugin-vue-components] extensions are required to search for components')

  resolved.dts = !options.dts
    ? false
    : resolve(
      root,
      typeof options.dts === 'string'
        ? options.dts
        : 'components.d.ts',
    )
  resolved.root = root

  return resolved
}
