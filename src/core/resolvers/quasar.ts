import { promises as fs } from 'fs'
import { resolveModule } from 'local-pkg'
import type { ComponentResolver } from '../../types'

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
        if (quasarApiListPath)
          components = JSON.parse(await fs.readFile(quasarApiListPath, 'utf-8'))
      }

      if (components.includes(name))
        return { name, from: 'quasar' }
    },
  }
}
