import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteComponents, { NaiveUiResolver } from 'unplugin-vue-components'

const config: UserConfig = {
  plugins: [
    Vue(),
    ViteComponents({
      customComponentResolvers: [
        NaiveUiResolver(),
      ],
      globalComponentsDeclaration: true,
    }),
  ],
}

export default config
