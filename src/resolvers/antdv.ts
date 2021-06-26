import { ComponentResolver } from '../types'

/**
 * Resolver for Ant Design Vue
 *
 * Requires ant-design-vue@v2.2.0-beta.6 or later
 *
 * See https://github.com/antfu/vite-plugin-components/issues/26#issuecomment-789767941 for more details
 *
 * @author @yangss3
 * @link https://antdv.com/
 */
export const AntDesignVueResolver = (): ComponentResolver => (name: string) => {
  if (name.match(/^A[A-Z]/))
    return {
      importName: name.slice(1),
      path: 'ant-design-vue/es',
      sideEffects: "ant-design-vue/es/style",
    }
}
