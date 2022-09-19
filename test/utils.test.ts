import { describe, expect, test } from 'vitest'
import type { ResolvedOptions } from '../src'
import { getNameFromFilePath } from '../src/core/utils'
describe('getNameFromFilePath', () => {
  const options: Partial<ResolvedOptions> = {
    directoryAsNamespace: true,
    globalNamespaces: [],
    collapseSamePrefixes: false,
    resolvedDirs: ['/src/components'],
  }

  test('normal name', () => {
    const inComponentFilePath = '/src/components/a/b.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a-b')
  })

  test('special char', () => {
    const inComponentFilePath = '/src/components/[a1]/b_2/c 3/d.4/[...ef]/ghi.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a1-b2-c3-d4-ef-ghi')
  })
})
