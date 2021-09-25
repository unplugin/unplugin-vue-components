import { join, normalize } from 'path'
import { ComponentResolver, SideEffectsInfo } from '../../types'
import { kebabCase, camelCase, pascalCase, resolveImportPath } from '../utils'

interface VeuiPeerConfig {
  /**
   * The package name of the peer module.
   */
  package: string

  /**
   * The directory path of the peer module.
   * @default 'components'
   */
  path?: string

  /**
   * The file name template for the peer module.
   * @default '{module}.css'
   */
  fileName?: `${string}{module}${string}`

  /**
   * The text transform to be applied to the '{module}' part of the file name.
   * @default 'kebab-case'
   */
  transform?: 'kebab-case' | 'camelCase' | 'PascalCase' | false
}

type SupportedLocale = 'en-US' | 'zh-Hans'

export interface VeuiResolverOptions {
  /**
   * The alias of 'veui` package.
   * @default 'veui'
   */
  alias?: string

  /**
   * Peer modules to be injected.
   */
  modules?: VeuiPeerConfig[]

  /**
   * Locale modules to be injected.
   * @default 'zh-Hans'
   */
  locale?: SupportedLocale | SupportedLocale[] | false

  /**
   * Global modules to be injected to all components.
   * @default []
   */
  global?: string[]
}

interface ComponentInfo {
  name: string
  path: string
}

const VEUI_PACKAGE_NAME = 'veui'
let components: Set<string> | undefined

/**
 * Resolver for VEUI
 *
 * @link https://github.com/ecomfe/veui
 */
export function VeuiResolver(options: VeuiResolverOptions): ComponentResolver {
  const { alias = VEUI_PACKAGE_NAME } = options

  if (!components) {
    try {
      /* eslint-disable @typescript-eslint/no-var-requires */
      const componentsData = require(`${alias}/components.json`) as ComponentInfo[]

      components = new Set(componentsData.map(({ name }) => name))
    }
    catch (e) {
      throw new Error('[unplugin-vue-components:veui] VEUI is not installed')
    }
  }

  return (name: string) => {
    if (name.match(/^Veui[A-Z]/)) {
      const componentName = name.slice(4)

      if (!components!.has(componentName)) return

      const sideEffects = getSideEffects(componentName, options)

      return { importName: componentName, path: alias, sideEffects }
    }
  }
}

const formatters = {
  'kebab-case': kebabCase,
  'camelCase': camelCase,
  'PascalCase': pascalCase,
}

const peerPaths = new Map<string, boolean>()

function assertPeerPath(peerPath: string) {
  if (!peerPaths.has(peerPath)) {
    try {
      resolveImportPath(peerPath)
      peerPaths.set(peerPath, true)
    }
    catch (e) {
      peerPaths.set(peerPath, false)
    }
  }

  return peerPaths.get(peerPath) as boolean
}

function getSideEffects(
  name: string,
  {
    alias = VEUI_PACKAGE_NAME,
    modules = [],
    locale = 'zh-Hans',
    global = [],
  }: VeuiResolverOptions,
): SideEffectsInfo {
  const localeModules = (locale
    ? Array.isArray(locale)
      ? locale
      : [locale]
    : []
  ).map(locale => `${alias}/locale/${locale}/${name}.js`)

  const peerModules = modules.map(
    ({
      package: pack,
      path = 'components',
      fileName = '{module}.css',
      transform = 'kebab-case',
    }) => {
      const peer = transform ? formatters[transform](name) : name
      const file = fileName.replace(/\$?\{module\}/g, peer)
      return normalize(join(pack, path, file))
    },
  )

  return [...localeModules, ...global, ...peerModules].filter(assertPeerPath)
}
