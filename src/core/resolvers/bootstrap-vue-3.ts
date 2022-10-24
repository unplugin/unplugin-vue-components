import type { ComponentResolver } from '../../types'

export interface BootstrapVue3ResolverOptions {
  /**
   * Auto import for directives.
   *
   * @default true
   */
  directives?: boolean
}

/**
 * Resolver for BootstrapVue
 *
 * @link https://github.com/cdmoro/bootstrap-vue-3
 */
export const BootstrapVue3Resolver = (_options: BootstrapVue3ResolverOptions = {}): Array<ComponentResolver> => {
  const options = { directives: true, ..._options }
  const resolvers: Array<ComponentResolver> = [{
    type: 'component',
    resolve: (name) => {
      if (name.match(/^B[A-Z]/))
        return { name, from: 'bootstrap-vue-3' }
    },
  }]

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name) => {
        if (name.match(/^B[A-Z]/))
          return { name: `V${name}`, from: 'bootstrap-vue-3' }
      },
    })
  }

  return resolvers
}
