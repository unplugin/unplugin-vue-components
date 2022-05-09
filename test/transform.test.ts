import { describe, expect, it } from 'vitest'
import type { ComponentResolver } from '../src'
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
  it('vue2 transform should work', async () => {
    const code = `
    var render = function () {
      var _vm = this
      var _h = _vm.$createElement
      var _c = _vm._self._c || _h
      return _c("test-comp", {
        directives: [
          { name: "loading", rawName: "v-loading", value: 123, expression: "123" }
        ]
      })
    }
    var staticRenderFns = []
    render._withStripped = true
    export { render, staticRenderFns }
    `

    const ctx = new Context({
      resolvers: [resolver],
      transformer: 'vue2',
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })

  it('vue3 transform should work', async () => {
    const code = `
    const render = (_ctx, _cache) => {
      const _component_test_comp = _resolveComponent("test-comp")
      const _directive_loading = _resolveDirective("loading")
    
      return _withDirectives(
        (_openBlock(),
        _createBlock(_component_test_comp, null, null, 512 /* NEED_PATCH */)),
        [[_directive_loading, 123]]
      )
    }
    `

    const ctx = new Context({
      resolvers: [resolver],
      transformer: 'vue3',
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })
})
