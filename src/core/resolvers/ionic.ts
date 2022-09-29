import type { ComponentResolver } from '../../types'

/**
 * Resolver for ionic framework
 *
 * @author @mathsgod
 * @link https://github.com/mathsgod
 */
export function IonicResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Ion')) {
        return {
          name,
          from: '@ionic/vue',
        }
      }
    },
  }
}
