import type { ComponentInfo, TypeImport } from '../../types'
import { notNullish } from '@antfu/utils'
import { isPackageExists } from 'local-pkg'
import { TypeImportPresets } from '.'

export function detectTypeImports(): TypeImport[] {
  return TypeImportPresets
    .map(i => isPackageExists(i.from) ? i : undefined)
    .filter(notNullish)
}

export function resolveTypeImports(imports: TypeImport[]): ComponentInfo[] {
  return imports.flatMap(i => i.names.map(n => ({ from: i.from, name: n, as: n })))
}
