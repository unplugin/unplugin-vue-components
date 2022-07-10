import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from '../../types'
import { getPkgVersion, kebabCase } from '../utils'

export interface BootstrapVuePlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean

  /**
   * specify bootstrap-vue-plus version to load style
   *
   * @default installed version
   */
  version?: string

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp
}

type BootstrapVuePlusResolverOptionsResolved = Required<Omit<BootstrapVuePlusResolverOptions, 'exclude'>> &
Pick<BootstrapVuePlusResolverOptions, 'exclude'>

function getSideEffects(dirName: string, options: BootstrapVuePlusResolverOptionsResolved): SideEffectsInfo | undefined {
  const { importStyle, ssr } = options
  const themeFolder = 'bootstrap-vue-plus/theme-chalk'
  const esComponentsFolder = 'bootstrap-vue-plus/es/components'

  if (importStyle === 'sass')
    return ssr ? `${themeFolder}/src/${dirName}.scss` : `${esComponentsFolder}/${dirName}/style/index`
  else if (importStyle === true || importStyle === 'css')
    return ssr ? `${themeFolder}/bv-${dirName}.css` : `${esComponentsFolder}/${dirName}/style/css`
}

function resolveComponent(name: string, options: BootstrapVuePlusResolverOptionsResolved): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude))
    return

  if (!name.match(/^Bv[A-Z]/))
    return

  if (name.match(/^BvIcon.+/)) {
    return {
      name: name.replace(/^BvIcon/, ''),
      from: '@bootstrap-vue-plus/icons-vue',
    }
  }

  const partialName = kebabCase(name.slice(2))// ElTableColumn -> table-column
  const { ssr } = options

  return {
    name,
    from: `bootstrap-vue-plus/${ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(partialName, options),
  }
}

function resolveDirective(name: string, options: BootstrapVuePlusResolverOptionsResolved): ComponentInfo | undefined {
  if (!options.directives)
    return

  const directives: Record<string, { importName: string; styleName: string }> = {
    Message: { importName: 'BvMessage', styleName: 'message' },
  }

  const directive = directives[name]
  if (!directive)
    return

  const { ssr } = options

  return {
    name: directive.importName,
    from: `bootstrap-vue-plus/${ssr ? 'lib' : 'es'}`,
    sideEffects: getSideEffects(directive.styleName, options),
  }
}

/**
 * Resolver for Bootstrap Vue Plus
 *
 *
 * @author @see
 * @link https://bootstrap-vue-plus.com for bootstrap-vue-plus
 *
 */
export function BootstrapVuePlusResolver(
  options: BootstrapVuePlusResolverOptionsResolved = ({} as BootstrapVuePlusResolverOptionsResolved),
): ComponentResolver[] {
  let optionsResolved: BootstrapVuePlusResolverOptionsResolved

  async function resolveOptions() {
    if (optionsResolved)
      return optionsResolved
    optionsResolved = {
      ssr: false,
      version: await getPkgVersion('bootstrap-vue-plus', '0.0.1'),
      importStyle: 'css',
      directives: true,
      exclude: undefined,
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        return resolveComponent(name, await resolveOptions())
      },
    },
    {
      type: 'directive',
      resolve: async (name: string) => {
        return resolveDirective(name, await resolveOptions())
      },
    },
  ]
}
