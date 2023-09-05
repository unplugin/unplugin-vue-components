import { dirname, isAbsolute, relative } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile as writeFile_ } from 'node:fs/promises'
import { notNullish, slash } from '@antfu/utils'
import type { ComponentInfo } from '../../dist'
import type { Options } from '../types'
import type { Context } from './context'
import { getTransformedPath } from './utils'
import { resolveTypeImports } from './type-imports/detect'

const multilineCommentsRE = /\/\*.*?\*\//gms
const singlelineCommentsRE = /\/\/.*$/gm

function extractImports(code: string) {
  return Object.fromEntries(Array.from(code.matchAll(/['"]?([^\s'"]+)['"]?\s*:\s*(.+?)[,;\n]/g)).map(i => [i[1], i[2]]))
}

export function parseDeclaration(code: string): DeclarationImports | undefined {
  if (!code)
    return

  code = code
    .replace(multilineCommentsRE, '')
    .replace(singlelineCommentsRE, '')

  const imports: DeclarationImports = {
    component: {},
    directive: {},
  }
  const componentDeclaration = /export\s+interface\s+GlobalComponents\s*{(.*?)}/s.exec(code)?.[0]
  if (componentDeclaration)
    imports.component = extractImports(componentDeclaration)

  const directiveDeclaration = /export\s+interface\s+ComponentCustomProperties\s*{(.*?)}/s.exec(code)?.[0]
  if (directiveDeclaration)
    imports.directive = extractImports(directiveDeclaration)

  return imports
}

/**
 * Converts `ComponentInfo` to an array
 *
 * `[name, "typeof import(path)[importName]"]`
 */
function stringifyComponentInfo(filepath: string, { from: path, as: name, name: importName }: ComponentInfo, importPathTransform?: Options['importPathTransform']): [string, string] | undefined {
  if (!name)
    return undefined
  path = getTransformedPath(path, importPathTransform)
  const related = isAbsolute(path)
    ? `./${relative(dirname(filepath), path)}`
    : path
  const entry = `typeof import('${slash(related)}')['${importName || 'default'}']`
  return [name, entry]
}

/**
 * Converts array of `ComponentInfo` to an import map
 *
 * `{ name: "typeof import(path)[importName]", ... }`
 */
export function stringifyComponentsInfo(filepath: string, components: ComponentInfo[], importPathTransform?: Options['importPathTransform']): Record<string, string> {
  return Object.fromEntries(
    components.map(info => stringifyComponentInfo(filepath, info, importPathTransform))
      .filter(notNullish),
  )
}

export interface DeclarationImports {
  component: Record<string, string>
  directive: Record<string, string>
}

export function getDeclarationImports(ctx: Context, filepath: string): DeclarationImports | undefined {
  const component = stringifyComponentsInfo(filepath, [
    ...Object.values({
      ...ctx.componentNameMap,
      ...ctx.componentCustomMap,
    }),
    ...resolveTypeImports(ctx.options.types),
  ], ctx.options.importPathTransform)

  const directive = stringifyComponentsInfo(
    filepath,
    Object.values(ctx.directiveCustomMap),
    ctx.options.importPathTransform,
  )

  if (
    (Object.keys(component).length + Object.keys(directive).length) === 0
  )
    return

  return { component, directive }
}

export function stringifyDeclarationImports(imports: Record<string, string>) {
  return Object.entries(imports)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, v]) => {
      if (!/^\w+$/.test(name))
        name = `'${name}'`
      return `${name}: ${v}`
    })
}

export function getDeclaration(ctx: Context, filepath: string, originalImports?: DeclarationImports) {
  const imports = getDeclarationImports(ctx, filepath)
  if (!imports)
    return

  const declarations = {
    component: stringifyDeclarationImports({ ...originalImports?.component, ...imports.component }),
    directive: stringifyDeclarationImports({ ...originalImports?.directive, ...imports.directive }),
  }

  const head = ctx.options.version === 2.7
    ? `export {}

declare module 'vue' {`
    : `export {}

declare module 'vue' {`

  let code = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-components
// Read more: https://github.com/vuejs/core/pull/3399
${head}`

  if (Object.keys(declarations.component).length > 0) {
    code += `
  export interface GlobalComponents {
    ${declarations.component.join('\n    ')}
  }`
  }
  if (Object.keys(declarations.directive).length > 0) {
    code += `
  export interface ComponentCustomProperties {
    ${declarations.directive.join('\n    ')}
  }`
  }
  code += '\n}\n/* prettier-ignore */\n'
  return code
}

async function writeFile(filePath: string, content: string) {
  await mkdir(dirname(filePath), { recursive: true })
  return await writeFile_(filePath, content, 'utf-8')
}

export async function writeDeclaration(ctx: Context, filepath: string, removeUnused = false) {
  const originalContent = existsSync(filepath) ? await readFile(filepath, 'utf-8') : ''
  const originalImports = removeUnused ? undefined : parseDeclaration(originalContent)

  const code = getDeclaration(ctx, filepath, originalImports)
  if (!code)
    return

  if (code !== originalContent)
    await writeFile(filepath, code)
}
