import type { UserConfig } from 'vite'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
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
    Markdown({}),
    Icons(),
    Inspect(),
    Components({
      dirs: ['src/components', 'src/layer-components'],
      extensions: ['vue', 'md', 'svg'],
      sort: 'pattern-desc',
      directoryAsNamespace: true,
      dts: true,
      globalNamespaces: ['global', 'sort-a', 'sort-b'],
      include: [/\.vue($|\?)/, /\.md($|\?)/],
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
      dumpComponentsInfo: true,
    }),
  ],
  build: {
    sourcemap: true,
  },
}

export default config
