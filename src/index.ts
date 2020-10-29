import type { Plugin } from 'vite'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { Options } from './types'
import { VueScriptTransformer } from './transforms/vueScript'
import { VueTemplateTransformer } from './transforms/vueTemplate'
import { Context } from './context'

const defaultOptions: Options = {
  include_dirs: 'src/components',
  namespaces: [
    'global',
    'partials'
  ],
  extensions: 'vue',
  deep: true,
  allowFolderNames: false,
  alias: {},
  root: process.cwd(),
}

function VitePluginComponents(options: Partial<Options> = {}): Plugin {
  const resolvedOptions: Options = Object.assign({}, defaultOptions, options)
  const ctx: Context = new Context(resolvedOptions)

  return {
    configureServer: createServerPlugin(ctx),
    rollupInputOptions: {
      plugins: [
        createRollupPlugin(ctx),
      ],
    },
    transforms: [
      VueScriptTransformer(ctx),
      VueTemplateTransformer(ctx),
    ],
  }
}

export type { Options }
export default VitePluginComponents
