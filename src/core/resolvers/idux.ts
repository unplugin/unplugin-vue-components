import { ComponentResolver } from '../../types'
import { kebabCase } from '../utils'

const cdkNames = [
  'portal',
  'resizable',
  'virtual-list',
]

const kebabCaseDirnames = [
  'virtual-list',
  'auto-complete',
  'back-top',
  'date-picker',
  'input-number',
  'time-picker',
  'tree-select',
]

export interface IduxResolverOptions {
  /**
   * import style along with components
   */
  importStyle?: 'css' | 'less'
}

/**
 * Resolver for `@idux/cdk` and `@idux/components`
 *
 * @link https://idux.site
 */
export function IduxResolver(options: IduxResolverOptions = {}): ComponentResolver {
  return (name: string) => {
    if (name.match(/^Ix[A-Z]/)) {
      const { importStyle } = options
      const compName = name.slice(2)
      const kebabCaseName = kebabCase(compName)
      const isCdk = cdkNames.includes(kebabCaseName)
      const packageName = isCdk ? 'cdk' : 'components'
      const dirname = getDirname(kebabCaseName)
      const path = `@idux/${packageName}/${dirname}`
      const sideEffects = isCdk || !importStyle ? undefined : `${path}/style/${importStyle === 'css' ? 'css' : 'index'}`

      return { importName: name, path, sideEffects }
    }
  }
}

function getDirname(compName: string): string {
  const dirname = kebabCaseDirnames.find(name => compName.startsWith(name))
  if (dirname)
    return dirname

  const [first] = compName.split('-')
  if (first === 'row' || first === 'col')
    return 'grid'

  return first
}
