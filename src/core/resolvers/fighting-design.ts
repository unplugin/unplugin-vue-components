import { isSSR, kebabCase } from '../utils'
import type { ComponentResolver } from '../../types'

const moduleType = isSSR ? 'lib' : 'es'

function getSideEffects(dirName: string): string {
  return `fighting-design/theme/${dirName}.css`
}

/**
 * Resolver for Fighting Design
 *
 * @author @Tyh2001
 * @link https://github.com/FightingDesign/fighting-design
 */
export function FightingDesignResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^I[A-Z]/)) {
        return {
          name,
          from: `fighting-design/${moduleType}`,
          sideEffects: getSideEffects(kebabCase(name)),
        }
      }
    },
  }
}
