import type { ComponentResolver } from '../../types'

/**
 * Resolver for Naive UI
 *
 * @author @antfu
 * @link https://www.naiveui.com/
 */
export function NaiveUiResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^(?:N[A-Z]|n-[a-z])/.test(name))
        return { name, from: 'naive-ui' }
    },
  }
}
