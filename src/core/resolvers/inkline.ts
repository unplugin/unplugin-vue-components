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
      if (/^I[A-Z]/.test(name)) {
        return {
          name,
          from: '@inkline/inkline',
        }
      }
    },
  }
}
