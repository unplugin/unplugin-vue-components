import type { ResolvedOptions } from '../src'
import { describe, expect, it } from 'vitest'
import { escapeSpecialChars, getNameFromFilePath, matchGlobs } from '../src/core/utils'

describe('getNameFromFilePath', () => {
  const options: Partial<ResolvedOptions> = {
    directoryAsNamespace: true,
    globalNamespaces: [],
    collapseSamePrefixes: false,
    resolvedDirs: ['/src/components'],
  }

  it('normal name', () => {
    const inComponentFilePath = '/src/components/a/b.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a-b')
  })

  it('special char', () => {
    const inComponentFilePath = '/src/components/[a1]/b_2/c 3/d.4/[...ef]/ghi.vue'
    expect(getNameFromFilePath(inComponentFilePath, options as ResolvedOptions)).toBe('a1-b2-c3-d4-ef-ghi')
  })
})

describe('escapeSpecialChars', () => {
  it('should escape parentheses', () => {
    expect(escapeSpecialChars('component()')).toBe('component\\(\\)')
  })

  it('should escape pipes in glob paths', () => {
    const glob = escapeSpecialChars('/work/|presentation/components/**/*.vue')

    expect(matchGlobs('/work/|presentation/components/Foo.vue', [glob])).toBe(true)
  })
})
