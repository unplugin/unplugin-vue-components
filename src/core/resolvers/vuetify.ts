import type { ComponentResolver } from '../../types'

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
        return { name, from: 'vuetify/lib' }
    },
  }
}

/**
 * Resolver for Vuetify 3 Beta
 *
 * @link https://github.com/vuetifyjs/vuetify
 */
export function Vuetify3Resolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^V[A-Z]/))
        return { name, from: 'vuetify/components' }
    },
  }
}
