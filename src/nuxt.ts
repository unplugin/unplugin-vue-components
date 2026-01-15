import type { NuxtModule } from '@nuxt/schema'
import type { Options } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import unplugin from '.'

const module: NuxtModule<Options, Options, false>
  = defineNuxtModule({
    setup(options: Options) {
      addWebpackPlugin(unplugin.webpack(options))
      addVitePlugin(unplugin.vite(options))
    },
  })

export default module
