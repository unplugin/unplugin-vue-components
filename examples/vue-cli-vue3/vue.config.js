const { defineConfig } = require('@vue/cli-service')
const Components = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      Components({
        dirs: [
          './src/components',
        ],
      }),
    ],
  },
})
