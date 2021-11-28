import { kebabCase } from '../utils'
import type { ComponentResolver } from '../../types'

export interface DevResolverOptions {
  /**
   * bring in components and styles
   *
   * @default true
   */
  importStyle?: boolean

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean
}

function getDefaultConf() {
  return {
    directive: true,
    importStyle: true,
  }
}

function getSideEffects(importName: string): string | undefined {
  return `vue-devui/${importName}/style.css`
}

function componentResolver(name: string, config: DevResolverOptions) { }

function directiveResolver(name: string, config: DevResolverOptions) { }

export function DevUiResolver(options: DevResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^D[A-Z]/)) {
        const config = { ...getDefaultConf(), ...options }

        name = name.slice(1)
        const _dir = kebabCase(name)

        return {
          importName: name,
          path: `vue-devui/${_dir}`,
          ...config.importStyle && { sideEffects: getSideEffects(_dir) },
        }
      }
    },
  }
}
