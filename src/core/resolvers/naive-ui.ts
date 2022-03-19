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
      if (name.match(/^(N[A-Z]|n-[a-z])/))
        return { importName: name, path: 'naive-ui' }
    },
  }
}
