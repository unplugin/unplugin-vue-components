import { ComponentResolver } from '../../types'
import { kebabCase } from '../utils'

function getSideEffects(componentName: string) {
  const sideEffects = [
    'view-design/dist/styles/iview.css',
    'popper.js/dist/umd/popper.js',
  ]

  if (/^Table|^Slider|^Tab/.test(componentName))
    sideEffects.push('element-resize-detector')

  if (/^Date/.test(componentName))
    sideEffects.push('js-calendar')

  return sideEffects
}

const matchComponents = [
  {
    pattern: /^List/,
    compDir: 'list',
  },
]

function getCompDir(compName: string): string {
  let compPath: string | undefined

  const total = matchComponents.length
  for (let i = 0; i < total; i++) {
    const matcher = matchComponents[i]
    if (compName.match(matcher.pattern)) {
      compPath = `${matcher.compDir}/${kebabCase(compName)}.vue`
      break
    }
  }
  if (!compPath)
    compPath = kebabCase(compName)

  return compPath
}

/**
 * Resolver for View UI
 * @requires @originjs/vite-plugin-commonjs
 * @author @nabaonan
 * @link https://www.iviewui.com/
 * @description has known problems list below
 * - select component render error PR: https://github.com/view-design/ViewUI/pull/944,  choose can't display value,because click option trigger twice,at second time,select value turn into undefined.
 * - scroll component has a template syntax called lang='html',it is require html-loader,but vite plugin not support yet,remove it can run. relate pr: https://github.com/view-design/ViewUI/pull/985
 */
export function ViewUiResolver(): ComponentResolver {
  return (name: string) => {
    if (name.match(/^I[A-Z]/)) {
      const compName = name.slice(1)
      return {
        path: `view-design/src/components/${getCompDir(compName)}`,
        sideEffects: getSideEffects(compName),
      }
    }
  }
}
