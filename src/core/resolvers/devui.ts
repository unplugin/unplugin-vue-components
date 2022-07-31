import { kebabCase } from '../utils'
import type { ComponentInfo, ComponentResolver, ImportInfo } from '../../types'

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

  /**
   * use umd lib file
   */
  ssr?: boolean
}

const LIB_NAME = 'vue-devui'
const HARMLESS = ['ripple']

// Locate the target path folder.
function resolveDirectory(name: string, filename: string) {
  return `${LIB_NAME}/${name}/${filename}`
}

// Gets the component style file
function getSideEffects(name: string) {
  if (HARMLESS.includes(name))
    return

  if (['row', 'col'].includes(name))
    return resolveDirectory('grid', 'style.css')

  if (['aside', 'content', 'footer', 'header', 'layout'].includes(name))
    return resolveDirectory('layout', 'style.css')

  if (['overlay', 'fixed-overlay', 'flexible-overlay'].includes(name))
    return resolveDirectory('overlay', 'style.css')

  return resolveDirectory(name, 'style.css')
}

function componentsResolver(name: string, { ssr }: DevResolverOptions): ComponentInfo | undefined {
  if (!name.match(/^D[A-Z]/))
    return

  // Alert => alert; DatePicker => date-picker
  const resolveId = kebabCase(name = name.slice(1))

  return {
    name,
    sideEffects: getSideEffects(resolveId),
    from: resolveDirectory(resolveId, `index.${ssr ? 'umd' : 'es'}.js`),
  }
}

function directivesResolver(name: string, { ssr }: DevResolverOptions): ComponentInfo | undefined {
  const resolveId = kebabCase(name)

  return {
    name: `${name}Directive`,
    sideEffects: getSideEffects(resolveId),
    from: resolveDirectory(resolveId, `index.${ssr ? 'umd' : 'es'}.js`),
  }
}

export function DevUiResolver(options: DevResolverOptions = {}): ComponentResolver[] {
  const config = { directives: true, importStyle: true, ssr: false, ...options }

  const resolvers: ComponentResolver[] = [
    {
      type: 'component',
      resolve: (name: string) => componentsResolver(name, config),
    },
  ]

  if (config.directives) {
    resolvers.push({
      type: 'directive',
      resolve: (name: string) => directivesResolver(name, config),
    })
  }

  return resolvers
}
