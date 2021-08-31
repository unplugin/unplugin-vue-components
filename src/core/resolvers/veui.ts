import { ComponentResolver } from '../../types'

/**
 * Resolver for VEUI
 *
 * @link https://github.com/ecomfe/veui
 */
export function VeuiResolver(): ComponentResolver {
  return (name: string) => {
    if (name.match(/^Veui[A-Z]/))
      return { importName: name.slice(4), path: 'veui' }
  }
}
