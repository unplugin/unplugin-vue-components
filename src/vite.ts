import type { Plugin } from 'vite'
import type { PublicPluginAPI, Options } from './types'
import unplugin from '.'

export default unplugin.vite as (options?: Options | undefined) => Plugin & { api: PublicPluginAPI }
