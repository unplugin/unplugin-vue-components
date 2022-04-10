import { isPackageExists } from 'local-pkg'
import { notNullish } from '@antfu/utils'
import type { ComponentInfo, TypeImport } from '../../types'
import { TypeImportPresets } from '.'

export function detectTypeImports(): TypeImport[] {
  return TypeImportPresets
    .map(i => isPackageExists(i.from) ? i : undefined)
    .filter(notNullish)
}

export function resolveTypeImports(imports: TypeImport[]): ComponentInfo[] {
  return imports.flatMap(i => i.names.map(n => ({ path: i.from, name: n, importName: n })))
}
