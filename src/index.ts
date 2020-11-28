import type { Plugin } from 'vite'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { Options } from './types'
import { VueScriptTransformer } from './transforms/vueScript'
import { VueTemplateTransformer } from './transforms/vueTemplate'
import { SVGTransformer } from './transforms/svg'
import { Context } from './context'

const defaultOptions: Options = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,

  directoryAsNamespace: false,
  globalNamespaces: [],

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
      SVGTransformer(ctx),
    ],
  }
}

export type { Options }
export default VitePluginComponents
