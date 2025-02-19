import type { ComponentResolver, ComponentResolverObject, Options, ResolvedOptions } from '../types'
import { join, resolve } from 'node:path'
import { slash, toArray } from '@antfu/utils'
import { getPackageInfoSync, isPackageExists } from 'local-pkg'
import { detectTypeImports } from './type-imports/detect'

export const defaultOptions: Omit<Required<Options>, 'include' | 'exclude' | 'excludeNames' | 'transformer' | 'globs' | 'directives' | 'types' | 'version'> = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,
  dts: isPackageExists('typescript'),

  directoryAsNamespace: false,
  collapseSamePrefixes: false,
  globalNamespaces: [],

  transformerUserResolveFunctions: true,

  resolvers: [],
  globsExclude: [],

  importPathTransform: v => v,

  allowOverrides: false,
}

function normalizeResolvers(resolvers: (ComponentResolver | ComponentResolver[])[]): ComponentResolverObject[] {
  return toArray(resolvers).flat().map(r => typeof r === 'function' ? { resolve: r, type: 'component' } : r)
}

function resolveGlobsExclude(root: string, glob: string) {
  const excludeReg = /^!/
  return `${excludeReg.test(glob) ? '!' : ''}${resolve(root, glob.replace(excludeReg, ''))}`
}

export function resolveOptions(options: Options, root: string): ResolvedOptions {
  const resolved = Object.assign({}, defaultOptions, options) as ResolvedOptions
  resolved.resolvers = normalizeResolvers(resolved.resolvers)
  resolved.extensions = toArray(resolved.extensions)

  if (resolved.globs) {
    resolved.globs = toArray(resolved.globs).map((glob: string) => slash(resolveGlobsExclude(root, glob)))
    resolved.resolvedDirs = []
  }
  else {
    const extsGlob = resolved.extensions.length === 1
      ? resolved.extensions
      : `{${resolved.extensions.join(',')}}`

    resolved.dirs = toArray(resolved.dirs)
    resolved.resolvedDirs = resolved.dirs.map(i => slash(resolveGlobsExclude(root, i)))

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
        typeof resolved.dts === 'string'
          ? resolved.dts
          : 'components.d.ts',
      )

  if (!resolved.types && resolved.dts)
    resolved.types = detectTypeImports()
  resolved.types = resolved.types || []

  resolved.root = root
  resolved.version = resolved.version ?? getVueVersion(root)
  if (resolved.version < 2 || resolved.version >= 4)
    throw new Error(`[unplugin-vue-components] unsupported version: ${resolved.version}`)

  resolved.transformer = options.transformer || `vue${Math.trunc(resolved.version) as 2 | 3}`
  resolved.directives = (typeof options.directives === 'boolean')
    ? options.directives
    : !resolved.resolvers.some(i => i.type === 'directive')
        ? false
        : resolved.version >= 3
  return resolved
}

function getVueVersion(root: string): 2 | 2.7 | 3 {
  // To fixed [mlly] issue: https://github.com/unjs/mlly/issues/158
  const raw = getPackageInfoSync('vue', { paths: [join(root, '/')] })?.version || '3'
  const version = +(raw.split('.').slice(0, 2).join('.'))
  if (version === 2.7)
    return 2.7
  else if (version < 2.7)
    return 2
  return 3
}
