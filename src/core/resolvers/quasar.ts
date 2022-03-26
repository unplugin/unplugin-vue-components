
import { promises } from 'fs'
import { resolveModule } from 'local-pkg'
import type { ComponentResolver } from '../../types'
const { readFile } = promises

/**
 * Resolver for Quasar
 *
 * @link https://github.com/quasarframework/quasar
 */
export function QuasarResolver(): ComponentResolver {
  let components: unknown[] = []

  return {
    type: 'component',
    resolve: async(name: string) => {
      if (!components.length) {
        const quasarApiListPath = resolveModule('quasar/dist/transforms/api-list.json')
        if (quasarApiListPath) components = JSON.parse((await readFile(quasarApiListPath)).toString())
      }

      if (components.includes(name))
        return { importName: name, path: 'quasar' }
    },
  }
}
