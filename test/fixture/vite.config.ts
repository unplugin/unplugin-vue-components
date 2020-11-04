import path from 'path'
import { UserConfig } from 'vite'
import ViteComponents from 'vite-plugin-components'

const alias = {
  '/~/': path.resolve(__dirname, 'src'),
}

const config: UserConfig = {
  alias: {
    '/~/': path.resolve(__dirname, 'src'),
  },
  plugins: [
    ViteComponents({
      alias,

      directoryAsNamespace: true,
      globalNamespaces: ['global'],
    }),
  ],
}

export default config
