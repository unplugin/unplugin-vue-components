import type { ComponentResolver } from '../../types'

export interface BootstrapVueNextResolverOptions {
  /**
   * Auto import for directives.
   *
   * @default true
   */
  directives?: boolean
}

/**
 * Resolver for BootstrapVue Next
 *
 * @link https://github.com/bootstrap-vue/bootstrap-vue-next
 */
export const BootstrapVueNextResolver = (_options: BootstrapVueNextResolverOptions = {}): Array<ComponentResolver> => {
  const options = { directives: true, ..._options }
  const resolvers: Array<ComponentResolver> = [{
    type: 'component',
    resolve: (name) => {
      if (name.match(/^B[A-Z]/))
        return { name, from: 'bootstrap-vue-next' }
    },
  }]

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name) => {
        if (name.match(/^B[A-Z]/))
          return { name: `V${name}`, from: 'bootstrap-vue-next' }
      },
    })
  }

  return resolvers
}
