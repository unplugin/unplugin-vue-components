import type { ComponentInfo, DtsConfigure, DtsDeclarationType, Options } from '../types'
import type { Context } from './context'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile as writeFile_ } from 'node:fs/promises'
import { dirname, isAbsolute, relative } from 'node:path'
import { notNullish, slash } from '@antfu/utils'
import { resolveTypeImports } from './type-imports/detect'
import { getTransformedPath } from './utils'

const multilineCommentsRE = /\/\*.*?\*\//gs
const singlelineCommentsRE = /\/\/.*$/gm

function extractImports(code: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
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
  const componentDeclaration = /export\s+interface\s+GlobalComponents\s*\{.*?\}/s.exec(code)?.[0]
  if (componentDeclaration)
    imports.component = extractImports(componentDeclaration)

  const directiveDeclaration = /export\s+interface\s+ComponentCustomProperties\s*\{.*?\}/s.exec(code)?.[0]
  if (directiveDeclaration)
    imports.directive = extractImports(directiveDeclaration)

  return imports
}

/**
 * Converts `ComponentInfo` to an import info.
 *
 * `{name, entry: "typeof import(path)[importName]", filepath}`
 */
function stringifyComponentInfo(dts: DtsConfigure, info: ComponentInfo, declarationType: DtsDeclarationType, importPathTransform?: Options['importPathTransform']): Record<'name' | 'entry' | 'filepath', string> | undefined {
  const { from: path, as: name, name: importName } = info

  if (!name)
    return undefined

  const filepath = dts(info, declarationType)
  if (!filepath)
    return undefined

  const transformedPath = getTransformedPath(path, importPathTransform)
  const related = isAbsolute(transformedPath)
    ? `./${relative(dirname(filepath), transformedPath)}`
    : transformedPath
  const entry = `typeof import('${slash(related)}')['${importName || 'default'}']`
  return { name, entry, filepath }
}

/**
 * Converts array of `ComponentInfo` to a filepath grouped import map.
 *
 * `{ filepath: { name: "typeof import(path)[importName]", ... } }`
 */
export function stringifyComponentsInfo(dts: DtsConfigure, components: ComponentInfo[], declarationType: DtsDeclarationType, importPathTransform?: Options['importPathTransform']): Record<string, Record<string, string>> {
  const stringified = components.map(info => stringifyComponentInfo(dts, info, declarationType, importPathTransform)).filter(notNullish)

  const filepathMap: Record<string, Record<string, string>> = {}

  for (const info of stringified) {
    const { name, entry, filepath } = info

    if (!filepathMap[filepath])
      filepathMap[filepath] = {}

    filepathMap[filepath][name] = entry
  }

  return filepathMap
}

export interface DeclarationImports {
  component: Record<string, string>
  directive: Record<string, string>
}

export function getDeclarationImports(ctx: Context): Record<string, DeclarationImports> | undefined {
  if (!ctx.options.dts)
    return undefined

  const componentMap = stringifyComponentsInfo(ctx.options.dts, [
    ...Object.values({
      ...ctx.componentNameMap,
      ...ctx.componentCustomMap,
    }),
    ...resolveTypeImports(ctx.options.types),
  ], 'component', ctx.options.importPathTransform)

  const directiveMap = stringifyComponentsInfo(
    ctx.options.dts,
    Object.values(ctx.directiveCustomMap),
    'directive',
    ctx.options.importPathTransform,
  )

  const declarationMap: Record<string, DeclarationImports> = {}

  for (const [filepath, component] of Object.entries(componentMap)) {
    if (!declarationMap[filepath])
      declarationMap[filepath] = { component: {}, directive: {} }

    declarationMap[filepath].component = {
      ...declarationMap[filepath].component,
      ...component,
    }
  }

  for (const [filepath, directive] of Object.entries(directiveMap)) {
    if (!declarationMap[filepath])
      declarationMap[filepath] = { component: {}, directive: {} }

    declarationMap[filepath].directive = {
      ...declarationMap[filepath].directive,
      ...directive,
    }
  }

  for (const [filepath, { component, directive }] of Object.entries(declarationMap)) {
    if (
      (Object.keys(component).length + Object.keys(directive).length) === 0
    )
      delete declarationMap[filepath]
  }

  return declarationMap
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

function getDeclaration(imports: DeclarationImports, originalImports?: DeclarationImports): string {
  const declarations = {
    component: stringifyDeclarationImports({ ...originalImports?.component, ...imports.component }),
    directive: stringifyDeclarationImports({ ...originalImports?.directive, ...imports.directive }),
  }

  let code = `/* eslint-disable */
// @ts-nocheck
// Generated by unplugin-vue-components
// Read more: https://github.com/vuejs/core/pull/3399
// biome-ignore lint: disable
export {}

/* prettier-ignore */
declare module 'vue' {`

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
  code += '\n}\n'
  return code
}

export async function getDeclarations(ctx: Context, removeUnused: boolean): Promise<Record<string, string> | undefined> {
  const importsMap = getDeclarationImports(ctx)
  if (!importsMap || !Object.keys(importsMap).length)
    return undefined

  const results = await Promise.all(Object.entries(importsMap).map(async ([filepath, imports]) => {
    const originalContent = existsSync(filepath) ? await readFile(filepath, 'utf-8') : ''
    const originalImports = removeUnused ? undefined : parseDeclaration(originalContent)

    const code = getDeclaration(imports, originalImports)

    if (code !== originalContent) {
      return [filepath, code]
    }
  }))

  return Object.fromEntries(results.filter(notNullish))
}

async function writeFile(filePath: string, content: string) {
  await mkdir(dirname(filePath), { recursive: true })
  return await writeFile_(filePath, content, 'utf-8')
}

export async function writeDeclaration(ctx: Context, removeUnused = false) {
  const declarations = await getDeclarations(ctx, removeUnused)
  if (!declarations || !Object.keys(declarations).length)
    return

  await Promise.all(
    Object.entries(declarations).map(async ([filepath, code]) => {
      return writeFile(filepath, code)
    }),
  )
}

export async function writeComponentsJson(ctx: Context, _removeUnused = false) {
  if (!ctx.dumpComponentsInfoPath)
    return

  const components = [
    ...Object.entries({
      ...ctx.componentNameMap,
      ...ctx.componentCustomMap,
    }).map(([_, { name, as, from }]) => ({
      name: name || 'default',
      as,
      from,
    })),
    ...resolveTypeImports(ctx.options.types),
  ]

  await writeFile(ctx.dumpComponentsInfoPath, JSON.stringify(components, null, 2))
}
