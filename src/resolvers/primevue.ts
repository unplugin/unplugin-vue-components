import { ComponentResolver } from '../types'

/**
 * Resolver for PrimeVue
 *
 * @author @primefaces
 * @link https://primefaces.org/primevue/showcase/#/
 */
export const PrimeVueResolver = (): ComponentResolver => (name: string) => {
  const prefix = 'Prime'
  if (name.startsWith(prefix)) {
    const trimmed = name.slice(prefix.length)
    return {
      path: `primevue/${trimmed.toLocaleLowerCase()}/${trimmed}`,
    }
  }
}
