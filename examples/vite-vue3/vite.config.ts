import path from 'path'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-md'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Inspect from 'vite-plugin-inspect'

const config: UserConfig = {
  resolve: {
    alias: {
      '/~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
    Icons(),
    Inspect(),
    Components({
      extensions: ['vue', 'md', 'svg'],
      directoryAsNamespace: true,
      dts: true,
      globalNamespaces: ['global'],
      include: [/\.vue$/, /\.md$/],
      resolvers: [
        (name) => {
          if (name === 'MyCustom')
            return '/src/CustomResolved.vue'
        },
        VantResolver(),
        IconsResolver({
          componentPrefix: 'i',
        }),
      ],
    }),
  ],
  build: {
    sourcemap: true,
  },
}

export default config
