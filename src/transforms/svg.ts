import { readFileSync } from 'fs'
import Debug from 'debug'
import type { Transform } from 'vite'
import { compileTemplate } from '@vue/compiler-sfc'
import { Context } from '../context'

const debug = Debug('vite-plugin-components:transform:svg')

/**
 * @param ctx
 */
export function SVGTransformer(ctx: Context): Transform {
  return {
    test({ path, query }) {
      return path.endsWith('.svg') && query.import != null
    },
    transform({ path }) {
      debug(path)
      const svg = readFileSync(path, 'utf8')
      let { code } = compileTemplate({
        source: svg,
        transformAssetUrls: false,
      })
      code = code.replace('export function render', 'export default function render')
      return `${code}`
    },
  }
}
