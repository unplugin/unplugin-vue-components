import { ComponentResolver } from '../types'

/**
 * Resolver for Vant
 *
 * @link https://github.com/youzan/vant
 */
export const VantResolver = (): ComponentResolver => (name: string) => {
  if (name.startsWith('Van'))
    return { importName: name.slice(3), path: 'vant' }
}
