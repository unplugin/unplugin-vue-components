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

interface Directive {
  importName: string
  styleName: string
}

export type Directives = Record<string, Directive>

const LIB_NAME = 'vue-devui'

const findStyle = (name: string) => `${LIB_NAME}/${name}/style.css`

const effectMaps: Record<string, string> = {
  'row,col': findStyle('grid'),
  'aside,content,footer,header,layout': findStyle('layout'),
  'overlay,fixed-overlay,flexible-overlay': findStyle('overlay'),
}

const effectKeys = Object.keys(effectMaps)

function getSideEffects(name: string): string | undefined {
  const match = effectKeys.find((key: string) => key.includes(name))
  return (match && effectMaps[match]) || findStyle(name)
}

function componentsResolver(name: string, config: DevResolverOptions) {
  if (!name.match(/^D[A-Z]/)) return

  // Alert => alert; DatePicker => date-picker
  const resolveId = kebabCase(name = name.slice(1))

  return {
    path: LIB_NAME,
    importName: name,
    sideEffects: getSideEffects(resolveId),
  }
}

function directivesResolver(name: string, config: DevResolverOptions) {
  if (!config.directives) return

  return {
    importName: name,
    path: `${LIB_NAME}/${name}`,
  }
}

export function DevUiResolver(options: DevResolverOptions = {}): ComponentResolver[] {
  const config = { directive: true, importStyle: true, ...options }

  return [
    { type: 'component', resolve: (name: string) => componentsResolver(name, config) },
    { type: 'directive', resolve: (name: string) => directivesResolver(name, config) },
  ]
}
