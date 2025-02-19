import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [
          '@babel/types',
        ],
      },
    },
  },
})
