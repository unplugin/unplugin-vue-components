import { describe, expect, it } from 'vitest'
import { TDesignResolver } from '../../src/resolvers'

import type { ComponentResolverObject } from '../../src'

describe('tDesignResolver', () => {
  it('name matching string rule should not be resolved', async () => {
    const resolver = TDesignResolver({ exclude: 'TString' }) as ComponentResolverObject
    expect(resolver.resolve('TString')).toBeFalsy()
  })

  it('name matching RegExp rule should not be resolved', async () => {
    const resolver = TDesignResolver({ exclude: /^TDoc[A-Z]/ }) as ComponentResolverObject
    expect(resolver.resolve('TDocRegExp')).toBeFalsy()
  })

  it('name matching Array<string | RegExp> rule should not be resolved', async () => {
    const resolver = TDesignResolver({ exclude: ['TString', /^TDoc[A-Z]/] }) as ComponentResolverObject
    expect(resolver.resolve('TString')).toBeFalsy()
    expect(resolver.resolve('TDocRegExp')).toBeFalsy()
  })
})
