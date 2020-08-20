import path from 'path'
import fg from 'fast-glob'
import { Options } from './options'

function toArray<T>(arr: T | T[]): T[] {
  if (Array.isArray(arr))
    return arr
  return [arr]
}

export async function generate({ dirs, extensions, deep }: Options) {
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

  const imports: [string, string][] = files.map(f => [path.parse(f).name, `/${f}`])

  return `${imports.map(([name, file]) => `import ${name} from '${file}'`).join('\n')}

export default {
  install(app) {
${imports.map(([name]) => `app.component('${name}', ${name})`).join('\n')}
  },
}
`
}
