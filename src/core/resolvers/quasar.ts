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
    resolve: async (name: string) => {
      if (!components.length) {
        ({
          default: components,
        } // @ts-expect-error no quasar types
          = await import('quasar/dist/transforms/api-list.json', {
            assert: { type: 'json' },
          }))
      }

      if (components.includes(name))
        return { name, from: 'quasar' }
    },
  }
}
