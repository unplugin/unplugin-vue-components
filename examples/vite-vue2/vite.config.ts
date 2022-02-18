import type { UserConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Components from 'unplugin-vue-components/vite'

const config: UserConfig = {
  plugins: [
    createVuePlugin(),
    Components({
      dts: 'src/components.d.ts',
    }),
  ],
  build: {
    sourcemap: true,
  },
}

export default config
