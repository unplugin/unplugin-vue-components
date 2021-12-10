import { describe, it, expect } from 'vitest'
import { ElementPlusResolver } from '../../src/resolvers'
import { Context } from '../../src/core/context'

describe('Element Plus Resolver', () => {
  it('components and directives should be transformed', async() => {
    const code = `
(_ctx, _cache) => {
  const _component_el_button = _resolveComponent("el-button")
  const _directive_loading = _resolveDirective("loading")

  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createVNode(_component_el_button, null, {
      default: _withCtx(() => [
        _hoisted_1
      ]),
      _: 1 /* STABLE */
    }),
    _withDirectives(_createElementVNode("div", null, null, 512 /* NEED_PATCH */), [
      [_directive_loading, true]
    ])
  ], 64 /* STABLE_FRAGMENT */))
}
`

    const ctx = new Context({
      resolvers: [ElementPlusResolver({})],
      transformer: 'vue3',
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })
})
