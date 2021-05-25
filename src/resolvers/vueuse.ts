import { ComponentResolver } from '../types'

/**
 * Resolve for VueUse Components
 * 
 * @link https://github.com/vueuse/vueuse
 */
export const VueUseComponentsResolver = (): ComponentResolver => (name: string) => {
  if (name.toLowerCase().startsWith('use') || name.toLowerCase().startsWith('on'))
    return { importName: name, path: '@vueuse/components' }
}
