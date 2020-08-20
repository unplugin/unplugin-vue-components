import type { Plugin } from 'vite'
import { createRollupPlugin } from './build'
import { createServerPlugin } from './server'
import { Options } from './options'

const defaultOptions: Options = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,
}

export function VitePluginComponents(options: Partial<Options> = {}): Plugin {
  const resolvedOptions: Options = Object.assign({}, options, defaultOptions)
  return {
    configureServer: createServerPlugin(resolvedOptions),
    rollupInputOptions: {
      plugins: [
        createRollupPlugin(resolvedOptions),
      ],
    },
  }
}
