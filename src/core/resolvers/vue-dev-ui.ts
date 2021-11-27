import { ComponentResolver } from '../../types'

const resolver = (name: string) => {
  if (name.match(/^D[A-Z]/)) {
    name = name.replace(/^D([A-Z])/, '$1')
    const _dirName = name.toLowerCase()

    return {
      importName: name,
      path: `vue-devui/${_dirName}/index.es.js`,
      sideEffects: [`vue-devui/${_dirName}/style.css`],
    }
  }
}

export function VueDevUiResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: resolver,
  }
}
