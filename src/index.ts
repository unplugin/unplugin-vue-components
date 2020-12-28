import type { Plugin } from 'vite'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { Options } from './types'
import { VueScriptTransformer } from './transforms/vueScript'
import { VueTemplateTransformer } from './transforms/vueTemplate'
import { Context } from './context'
import { VueScriptSetupTransformer } from './transforms/vueScriptSetup'
import { CustomComponentTransformer } from './transforms/customComponent'
import { resolveOptions } from './utils'

const defaultOptions: Required<Options> = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,

  directoryAsNamespace: false,
  globalNamespaces: [],

  alias: {},
  root: process.cwd(),

  libraries: [],

  customLoaderMatcher: () => false,
  customComponentResolvers: [],
}

function VitePluginComponents(options: Options = {}): Plugin {
  const ctx: Context = new Context(resolveOptions(options, defaultOptions))

  return {
    configureServer: createServerPlugin(ctx),
    rollupInputOptions: {
      pluginsPreBuild: [
        createRollupPlugin(ctx),
      ],
    },
    transforms: [
      VueScriptSetupTransformer(ctx),
      VueScriptTransformer(ctx),
      VueTemplateTransformer(ctx),
      CustomComponentTransformer(ctx),
    ],
  }
}

export * from './helpers/libraryResolver'
export * from './types'
export { camelCase, pascalCase, kebabCase } from './utils'
export default VitePluginComponents
