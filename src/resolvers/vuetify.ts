import { ComponentResolver } from '../types'

/**
 * Resolver for Vuetify
 *
 * @link https://github.com/vuetifyjs/vuetify
 */
export const VuetifyResolver = (): ComponentResolver => (name: string) => {
  if (name.match(/^V[A-Z]/))
    return { importName: name, path: 'vuetify/lib' }
}
