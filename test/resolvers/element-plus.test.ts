import { describe, expect, it } from 'vitest'
import { Context } from '../../src/core/context'
import { ElementPlusResolver } from '../../src/resolvers'

describe('element Plus Resolver', () => {
  it('components and directives should be transformed', async () => {
    const code = `
(_ctx, _cache) => {
  const _component_el_button = _resolveComponent("el-button")
  const _component_el_icon_apple = _resolveComponent("el-icon-apple")
  const _directive_loading = _resolveDirective("loading")

  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createVNode(_component_el_button),
    _createVNode(_component_el_icon_apple),
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
