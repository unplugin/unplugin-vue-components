import { join, resolve } from 'path'
import { slash, toArray } from '@antfu/utils'
import { isPackageExists } from 'local-pkg'
import { ResolvedOptions, Options, ComponentResolver, ComponentResolverObject } from '../types'
import { LibraryResolver } from './helpers/libraryResolver'

export const defaultOptions: Omit<Required<Options>, 'include' | 'exclude' | 'transformer' | 'globs' |'directives'> = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,
  dts: isPackageExists('typescript'),

  directoryAsNamespace: false,
  globalNamespaces: [],

  libraries: [],
  resolvers: [],

  importPathTransform: v => v,

  allowOverrides: false,
}

function normalizeResolvers(resolvers: (ComponentResolver | ComponentResolver[])[]): ComponentResolverObject[] {
  return toArray(resolvers).flat().map(r => typeof r === 'function' ? { resolve: r, type: 'component' } : r)
}

export function resolveOptions(options: Options, root: string): ResolvedOptions {
  const resolved = Object.assign({}, defaultOptions, options) as ResolvedOptions
  resolved.libraries = toArray(resolved.libraries).map(i => typeof i === 'string' ? { name: i } : i)
  resolved.resolvers = normalizeResolvers(resolved.resolvers)
  resolved.resolvers.push(...resolved.libraries.map(lib => LibraryResolver(lib)))
  resolved.extensions = toArray(resolved.extensions)

  if (resolved.globs) {
    resolved.globs = toArray(resolved.globs).map((glob: string) => slash(resolve(root, glob)))
    resolved.resolvedDirs = []
  }
  else {
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
      throw new Error('[unplugin-vue-components] `extensions` option is required to search for components')
  }

  resolved.dts = !resolved.dts
    ? false
    : resolve(
      root,
      typeof options.dts === 'string'
        ? options.dts
        : 'components.d.ts',
    )
  resolved.root = root
  resolved.transformer = options.transformer || getVueVersion() || 'vue3'
  resolved.directives = (typeof options.directives === 'boolean')
    ? options.directives
    : !resolved.resolvers.some(i => i.type === 'directive')
      ? false
      : getVueVersion() === 'vue3'

  return resolved
}

function getVueVersion() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const vue = require('vue')
    const version = vue?.default?.version || vue?.version || '3'
    return version.startsWith('2.') ? 'vue2' : 'vue3'
  }
  catch {
    return null
  }
}
