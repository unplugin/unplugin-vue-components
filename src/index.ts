import type { Plugin } from 'vite'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { Options, Context } from './types'
import { VueScriptTransformer } from './transforms/vueScript'
import { VueTemplateTransformer } from './transforms/vueTemplate'

const defaultOptions: Options = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,
}

function VitePluginComponents(options: Partial<Options> = {}): Plugin {
  const resolvedOptions: Options = Object.assign({}, options, defaultOptions)
  const ctx: Context = {
    options: resolvedOptions,
    importMap: {},
    components: [],
  }

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
