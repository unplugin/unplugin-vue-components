import type { Plugin } from 'vite'
import type { Options, PublicPluginAPI } from './types'
import unplugin from '.'

const vite = unplugin.vite as (options?: Options | undefined) => Plugin & { api: PublicPluginAPI }
export default vite
export { vite as 'module.exports' }
