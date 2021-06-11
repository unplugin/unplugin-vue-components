import { ComponentResolver } from '../types'

/**
 * Resolver for Naive UI
 *
 * @author @antfu
 * @link https://www.naiveui.com/
 */
export const NaiveUiResolver = (): ComponentResolver => (name: string) => {
  if (name.match(/^N[A-Z]/))
    return { importName: name, path: 'naive-ui' }
}
