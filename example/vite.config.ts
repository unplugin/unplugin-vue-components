import path from 'path'
import { UserConfig } from 'vite'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'

const alias = {
  '/~/': path.resolve(__dirname, 'src'),
}

const config: UserConfig = {
  alias: {
    '/~/': path.resolve(__dirname, 'src'),
  },
  plugins: [
    Markdown(),
    ViteComponents({
      extensions: ['vue', 'md'],
      alias,
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      customLoaderMatcher: ({ path }) => path.endsWith('.md'),
      customComponentResolvers: (name) => {
        if (name === 'MyCustom')
          return '/src/CustomResolved.vue'
      },
    }),
  ],
}

export default config
