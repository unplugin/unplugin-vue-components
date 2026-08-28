import type { ResolvedOptions } from '../src'
import { describe, expect, it } from 'vitest'
import { escapeGlobRootPrefix, escapeSpecialChars, getNameFromFilePath, matchGlobs } from '../src/core/utils'

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

  it('should escape square brackets so they are not treated as character classes', () => {
    expect(escapeSpecialChars('/proj/[Foo]/src')).toBe('/proj/\\[Foo\\]/src')
  })
})

describe('matchGlobs', () => {
  it('matches a path whose resolved base contains square brackets', () => {
    const filepath = '/Github/Project/[Foo]/ui/src/component/Button.vue'
    const glob = escapeSpecialChars('/Github/Project/[Foo]/ui/src/component/**/*.vue')
    expect(matchGlobs(filepath, [glob])).toBe(true)
  })

  it('matches a path whose directory name is a picomatch character-class range', () => {
    const filepath = '/Github/Project/[a-z]/ui/src/component/Button.vue'
    const glob = escapeSpecialChars('/Github/Project/[a-z]/ui/src/component/**/*.vue')
    expect(matchGlobs(filepath, [glob])).toBe(true)
  })
})

describe('escapeGlobRootPrefix', () => {
  it('escapes metacharacters in the root prefix', () => {
    expect(escapeGlobRootPrefix('/proj/[Foo]/src/**/*.vue', '/proj/[Foo]'))
      .toBe('/proj/\\[Foo\\]/src/**/*.vue')
  })

  it('leaves user-supplied glob syntax after the root untouched', () => {
    // `dirs: ['src/[ab]']` under a plain root must still behave as a character
    // class, so only the root prefix may be escaped.
    const glob = escapeGlobRootPrefix('/proj/src/[ab]/**/*.vue', '/proj')
    expect(glob).toBe('/proj/src/[ab]/**/*.vue')
    expect(matchGlobs('/proj/src/a/Button.vue', [glob])).toBe(true)
    expect(matchGlobs('/proj/src/b/Button.vue', [glob])).toBe(true)
    expect(matchGlobs('/proj/src/c/Button.vue', [glob])).toBe(false)
  })

  it('handles both at once: metacharacters in the root and a glob after it', () => {
    const glob = escapeGlobRootPrefix('/proj/Code(T)/src/[ab]/**/*.vue', '/proj/Code(T)')
    expect(matchGlobs('/proj/Code(T)/src/a/Button.vue', [glob])).toBe(true)
    expect(matchGlobs('/proj/Code(T)/src/c/Button.vue', [glob])).toBe(false)
  })
})
