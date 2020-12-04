import path from 'path'
import { UserConfig } from 'vite'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import svg from 'vite-plugin-svg'

const alias = {
  '/~/': path.resolve(__dirname, 'src'),
}

const config: UserConfig = {
  alias: {
    '/~/': path.resolve(__dirname, 'src'),
  },
  plugins: [
    Markdown(),
    svg(),
    ViteComponents({
      extensions: ['vue', 'md', 'svg'],
      alias,
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      customLoaderMatcher: ({ path }) => path.endsWith('.md'),
      customImportMapper: (name, path) => path.endsWith('.svg') ? `import { VueComponent as ${name} } from "/${path}"` : false,
    }),
  ],
}

export default config
