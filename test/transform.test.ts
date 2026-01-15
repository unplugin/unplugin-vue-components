import type { ComponentResolver } from '../src'
import { describe, expect, it } from 'vitest'
import { pascalCase } from '../src'
import { Context } from '../src/core/context'

const resolver: ComponentResolver[] = [
  {
    type: 'component',
    resolve: name => ({ from: `test/component/${name}` }),
  },
  {
    type: 'directive',
    resolve: name => ({ from: `test/directive/${name}` }),
  },
]

describe('transform', () => {
  it('vue3 transform should work', async () => {
    const code = `
    const render = (_ctx, _cache) => {
      const _component_test_comp = _resolveComponent("test-comp")
      const _directive_loading = _resolveDirective("loading")
      
      const _resolveNoUnderscore = resolveComponent("test-comp")

      return _withDirectives(
        (_openBlock(),
        _createBlock(_resolveNoUnderscore, null, null, 512 /* NEED_PATCH */)),
        _createBlock(_component_test_comp, null, null, 512 /* NEED_PATCH */)),
        [[_directive_loading, 123]]
      )
    }
    `

    let ctx = new Context({
      resolvers: [resolver],
      transformerUserResolveFunctions: false,
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot('no-user-resolve')

    ctx = new Context({
      resolvers: [resolver],
      transformerUserResolveFunctions: true,
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot('with-user-resolve')
  })
})

describe('component and directive as same name', () => {
  it('vue3 transform should work', async () => {
    const code = `
    const render = (_ctx, _cache) => {
      const _component_el_infinite_scroll = _resolveComponent("el-infinite-scroll")
      const _directive_el_infinite_scroll = _resolveDirective("el-infinite-scroll")
    
      return _withDirectives(
        (_openBlock(),
        _createBlock(_component_test_comp, null, null, 512 /* NEED_PATCH */)),
        [[_directive_loading, 123]]
      )
    }
    `

    const ctx = new Context({
      resolvers: [resolver],
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })
})

describe('prefix transform', () => {
  it('transform with prefix should work', async () => {
    const code = `
    const render = (_ctx, _cache) => {
      const _component_test_comp = _resolveComponent("custom-prefix-test-comp")
      const _component_testComp = _resolveComponent("CustomPrefixTestComp")
      const _component_testComp = _resolveComponent("customPrefixTestComp")

      return _withDirectives(
        (_openBlock(),
        _createBlock(_component_test_comp, null, null, 512 /* NEED_PATCH */)),
        _createBlock(_component_testComp, null, null, 512 /* NEED_PATCH */)),
        _createBlock(_component_TestComp, null, null, 512 /* NEED_PATCH */))
      )
    }
    `

    const ctx = new Context({
      prefix: 'CustomPrefix',
      directives: true,
    })
    ctx.sourcemap = false
    const componentName = 'TestComp'
    const name = `${pascalCase(ctx.options.prefix)}${pascalCase(componentName)}`
    // @ts-expect-error for test
    ctx._componentNameMap = {
      [name]: {
        as: name,
        from: 'test/component/test-comp.vue',
      },
    }
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })
})
