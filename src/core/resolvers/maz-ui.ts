import type { ComponentResolver } from '../../types'
import { pascalCase } from '../utils'

/**
 * Resolver for Maz-UI
 *
 * @author @louismazel
 * @link https://louismazel.github.io/maz-ui-3
 */
export function MazUiResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^(Maz[A-Z])/))
        return { from: `maz-ui/components/${name}` }

      else if (name.match(/^(maz-[a-z])/))
        return { from: `maz-ui/components/${pascalCase(name)}` }
    },
  }
}
