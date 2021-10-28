
import { ComponentResolver } from '../../types'

/**
 * Resolver for Quasar
 *
 * @link https://github.com/quasarframework/quasar
 */
export function QuasarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      let components = []

      try {
        /* eslint-disable @typescript-eslint/no-var-requires */
        components = require('quasar/dist/transforms/api-list.json')
      }
      catch (e) {
      }

      if (components.includes(name))
        return { importName: name, path: 'quasar' }
    },
  }
}
