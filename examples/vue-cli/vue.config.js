/* eslint-disable @typescript-eslint/no-var-requires */

const ScriptSetup = require('unplugin-vue2-script-setup/webpack')
const Icons = require('unplugin-icons/webpack')
const IconsResolver = require('unplugin-icons/resolver')
const Components = require('unplugin-vue-components/webpack')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  configureWebpack: {
    plugins: [
      ScriptSetup({
        refTransform: true,
      }),
      Icons({
        compiler: 'vue2',
      }),
      Components({
        resolvers: [
          // https://github.com/antfu/unplugin-icons
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        transformer: 'vue2',
      }),
    ],
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker')

    // disable cache for testing, you should remove this in production
    config.module.rule('vue').uses.delete('cache-loader')
    config.module.rule('js').uses.delete('cache-loader')
    config.module.rule('ts').uses.delete('cache-loader')
    config.module.rule('tsx').uses.delete('cache-loader')
  },
}
