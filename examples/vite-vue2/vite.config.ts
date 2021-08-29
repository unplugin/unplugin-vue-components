import { UserConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import ViteComponents from 'unplugin-vue-components'

const config: UserConfig = {
  plugins: [
    createVuePlugin(),
    ViteComponents(),
  ],
  build: {
    sourcemap: true,
  },
}

export default config
