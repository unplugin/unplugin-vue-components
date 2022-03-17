import type { Plugin } from 'vite'
import type { Options, PublicPluginAPI } from './types'
import unplugin from '.'

export default unplugin.vite as (options?: Options | undefined) => Plugin & { api: PublicPluginAPI }
