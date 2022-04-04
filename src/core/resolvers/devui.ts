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

const LIB_NAME = 'vue-devui'

const findStyle = (name: string) => {
  if (!name || !Array.isArray(name))
    return `${LIB_NAME}/${name}/style.css`
}

const effectComponentMaps: Record<string, string> = {
  'row,col': 'grid',
  'aside,content,footer,header,layout': 'layout',
  'overlay,fixed-overlay,flexible-overlay': 'overlay',
}

const effectDirectiveMaps: Record<string, string> = {
  // Directives exist, but style files are not required
  Ripple: '',
  Draggable: '',
  Droppable: '',

  Loading: 'loading',
  ImagePreview: 'image-preview',
}

const effectComponentKeys = Object.keys(effectComponentMaps)

// Gets the component style file
function getSideEffects(name: string): string | undefined {
  const match = effectComponentKeys.find((key: string) => key.includes(name))
  return (match && effectComponentMaps[match]) && findStyle(match)
}

function componentsResolver(name: string) {
  if (!name.match(/^D[A-Z]/))
    return

  // Alert => alert; DatePicker => date-picker
  const resolveId = kebabCase(name = name.slice(1))

  return {
    path: LIB_NAME,
    importName: name,
    sideEffects: getSideEffects(resolveId),
  }
}

function directivesResolver(name: string) {
  if (!(name in effectDirectiveMaps))
    return

  return {
    path: LIB_NAME,
    importName: `${name}Directive`,
    sideEffects: findStyle(effectDirectiveMaps[name]),
  }
}

export function DevUiResolver(options: DevResolverOptions = {}): ComponentResolver[] {
  const config = { directives: true, importStyle: true, ...options }

  const resolvers: ComponentResolver[] = [
    { type: 'component', resolve: componentsResolver },
  ]

  if (config.directives)
    resolvers.push({ type: 'directive', resolve: directivesResolver })

  return resolvers
}
