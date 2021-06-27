import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'

const config: UserConfig = {
  plugins: [
    Vue(),
    ViteComponents({
      customComponentResolvers: [
        AntDesignVueResolver({
          // importLess: true,
        }),
      ],
      globalComponentsDeclaration: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
}

export default config
