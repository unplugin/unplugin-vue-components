import { describe, expect, test } from 'vitest'
import { ArcoResolver } from '../../src/resolvers'

import type { ComponentResolveResult, ComponentResolverObject } from '../../src'

function testNoIconComponentResolve(resolver: ComponentResolverObject) {
  expect(resolver.resolve('AButton')).toEqual<ComponentResolveResult>({
    name: 'Button',
    from: '@arco-design/web-vue',
    sideEffects: '@arco-design/web-vue/es/button/style/css.js',
  })
}

describe('ArcoResolver', () => {
  test('Resolve component except icon', async () => {
    const resolver = ArcoResolver() as ComponentResolverObject
    expect(typeof resolver).toEqual('object')
    testNoIconComponentResolve(resolver)
    expect(resolver.resolve('IconStar')).toBeFalsy()
  })

  test('Can resolve icon component', () => {
    const resolver = ArcoResolver({ resolveIcons: true }) as ComponentResolverObject
    testNoIconComponentResolve(resolver)
    expect(resolver.resolve('IconStar')).toEqual<ComponentResolveResult>({
      name: 'IconStar',
      from: '@arco-design/web-vue/es/icon',
      as: 'IconStar',
    })
  })

  test('Can resolve icon component with custom icon prefix', () => {
    const resolver = ArcoResolver({ resolveIcons: { enable: true, iconPrefix: 'arco' } }) as ComponentResolverObject
    testNoIconComponentResolve(resolver)
    expect(resolver.resolve('ArcoIconStar')).toEqual<ComponentResolveResult>({
      name: 'IconStar',
      from: '@arco-design/web-vue/es/icon',
      as: 'ArcoIconStar',
    })
  })
})
