import type { ComponentResolver } from '../../types'

/**
 * Resolver for BootstrapVue
 *
 * @link https://github.com/bootstrap-vue/bootstrap-vue
 */
export function BootstrapVueResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^B[A-Z]/))
        return { name, from: 'bootstrap-vue' }
    },
  }
}
