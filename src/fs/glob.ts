import path from 'path'
import fg from 'fast-glob'
import Debug from 'debug'
import { ComponentsInfo } from '../types'
import { Context } from '../context'

const debug = Debug('vite-plugin-components:glob')

function toArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr))
    return arr
  return [arr]
}

/**
 * This search for components in with the given options.
 * Will be called multiple times to ensure file loaded,
 * should normally run only once.
 *
 * TODO: watch on file changes for server mode
 *
 * @param ctx
 * @param force
 */
export async function searchComponents(ctx: Context, force = false) {
  if (force || !ctx._searchingPromise) {
    ctx._searchingPromise = (async() => {
      const { dirs, deep, extensions } = ctx.options
      const exts = toArray(extensions)

      if (!exts.length)
        throw new Error('[vite-plugin-components] extensions are required to search for components')

      const extsGlob = exts.length === 1 ? exts[0] : `{${exts.join(',')}}`
      const globs = toArray(dirs).map(i =>
        deep
          ? `${i}/**/*.${extsGlob}`
          : `${i}/*.${extsGlob}`,
      )

      debug(`searching start with: [${globs.join(', ')}]`)

      const files = await fg(globs, {
        ignore: [
          'node_modules',
        ],
        onlyFiles: true,
      })

      if (!files.length)
        console.warn('[vite-plugin-components] no components found')

      const nameSets = new Set<string>()
      const components = files
        .map((f): ComponentsInfo => [path.parse(f).name, `/${f}`])
        .filter(([name, path]) => {
          if (nameSets.has(name)) {
            console.warn(`[vite-plugin-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`)
            return false
          }
          else {
            nameSets.add(name)
            return true
          }
        })

      debug(`${components.length} components found.`)
      debug(components.map(i => i[0]))

      ctx.components = components
    })()
  }

  await Promise.resolve(ctx._searchingPromise)
}
