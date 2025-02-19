import type { ResolvedOptions } from '../src'
import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { getNameFromFilePath } from '../src/core/utils'

describe('getNameFromFilePath', () => {
  const options: Partial<ResolvedOptions> = resolveOptions({
    directoryAsNamespace: true,
    globalNamespaces: [],
    collapseSamePrefixes: false,
    dirs: ['/src/components'],
    extensions: ['vue', 'ce.vue'],
  }, '/')

  it('normal name', () => {
    const inComponentFilePath = '/src/components/a/b.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a-b')
  })

  it('special char', () => {
    const inComponentFilePath = '/src/components/[a1]/b_2/c 3/d.4/[...ef]/ghi.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a1-b2-c3-d4-ef-ghi')
  })

  it(('long extensions'), () => {
    const inComponentFilePath = '/src/components/b.ce.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('b')
  })

  it(('long extensions and nested'), () => {
    const inComponentFilePath = '/src/components/a/b.ce.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a-b')
  })
})
