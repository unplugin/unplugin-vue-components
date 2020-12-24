import type { Plugin } from 'vite'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { Options } from './types'
import { VueScriptTransformer } from './transforms/vueScript'
import { VueTemplateTransformer } from './transforms/vueTemplate'
import { Context } from './context'
import { VueScriptSetupTransformer } from './transforms/vueScriptSetup'
import { CustomComponentTransformer } from './transforms/customComponent'

const defaultOptions: Options = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,

  directoryAsNamespace: false,
  globalNamespaces: [],

  alias: {},
  root: process.cwd(),

  customLoaderMatcher: () => false,
  customComponentResolvers: [],
}

function VitePluginComponents(options: Partial<Options> = {}): Plugin {
  const resolvedOptions: Options = Object.assign({}, defaultOptions, options)
  const ctx: Context = new Context(resolvedOptions)

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

export type { Options }
export default VitePluginComponents
