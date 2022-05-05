import type { ComponentResolver } from '../../types'

/**
 * Resolver for Inkline
 *
 * @author @alexgrozav
 * @link https://github.com/inkline/inkline
 */
export function InklineResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^I[A-Z]/)) {
        return {
          name,
          from: '@inkline/inkline',
        }
      }
    },
  }
}
