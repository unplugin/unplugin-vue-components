import path from 'path'
import fg from 'fast-glob'
import { Context, ComponentsInfo } from './types'

function toArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr))
    return arr
  return [arr]
}

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

      const files = await fg(globs, {
        ignore: [
          'node_modules',
        ],
        onlyFiles: true,
      })

      if (!files.length)
        console.warn('[vite-plugin-components] no components found')

      const components: ComponentsInfo[] = files.map(f => [path.parse(f).name, `/${f}`])

      ctx.components = components
      ctx._searchingPromise = undefined
    })()
  }

  return await ctx._searchingPromise
}
