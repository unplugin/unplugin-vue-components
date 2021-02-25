import path from 'path'
import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import SVG from 'vite-plugin-vue-svg'

const config: UserConfig = {
  alias: {
    '/~/': `${path.resolve(__dirname, 'src')}/`,
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
    SVG(),
    ViteComponents({
      extensions: ['vue', 'md', 'svg'],
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      importPathTransform: path => path.endsWith('.svg') ? `${path}?component` : undefined,
      customLoaderMatcher: path => path.endsWith('.md'),
      customComponentResolvers: [
        (name) => {
          if (name === 'MyCustom')
            return '/src/CustomResolved.vue'
        },
        // auto import from ui library Vant
        (name: string) => {
          if (name.startsWith('Van'))
            return { importName: name.slice(3), path: 'vant' }
        },
      ],
    }),
  ],
}

export default config
