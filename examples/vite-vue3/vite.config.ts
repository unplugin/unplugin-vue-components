import path from 'node:path'
import type { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-vue-markdown'
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
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        (name) => {
          if (name === 'MyCustom')
            return path.resolve(__dirname, 'src/CustomResolved.vue').replaceAll('\\', '/')
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
