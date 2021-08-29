import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteComponents, { NaiveUiResolver } from 'unplugin-vue-components'

const config: UserConfig = {
  plugins: [
    Vue(),
    ViteComponents({
      resolvers: [
        NaiveUiResolver(),
      ],
      globalComponentsDeclaration: true,
    }),
  ],
}

export default config
