import { ComponentResolver } from '../../types'

/**
 * Resolver for Vuetify
 *
 * @link https://github.com/vuetifyjs/vuetify
 */
export function VuetifyResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^V[A-Z]/))
        return { importName: name, path: 'vuetify/lib' }
    },
  }
}
