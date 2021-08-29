import path from 'path'
import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteComponents from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-md'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// @ts-expect-error
import SVG from 'vite-plugin-vue-svg'
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
    SVG(),
    Icons(),
    Inspect(),
    ViteComponents({
      extensions: ['vue', 'md', 'svg'],
      directoryAsNamespace: true,
      dts: true,
      globalNamespaces: ['global'],
      importPathTransform: path => path.endsWith('.svg') ? `${path}?component` : undefined,
      customLoaderMatcher: path => path.endsWith('.md'),
      customComponentResolvers: [
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
