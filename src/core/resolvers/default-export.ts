import type { ComponentResolver } from '../../types'

export function defaultExportResolver(exports: {
  name: string
  from: string
}[]): ComponentResolver {
  const map = new Map<string, string>()
  for (const { name, from } of exports)
    map.set(name, from)
  return {
    type: 'component',
    resolve: (name: string) => {
      if (map.has(name)) {
        return ({
          name: 'default',
          from: map.get(name)!,
        })
      }
    }
  }
}
