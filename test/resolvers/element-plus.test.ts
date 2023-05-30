import { describe, expect, it } from 'vitest'
import { ElementPlusResolver } from '../../src/resolvers'
import { Context } from '../../src/core/context'

describe('Element Plus Resolver', () => {
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

  it('auto load dynamically created component styles', async () => {
    const code = `
    import { ref } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    
    const _sfc_main = {
      __name: 'App',
      setup(__props, { expose }) {
      expose();
    
    const loading = ref(true)
    const test1 = (_) => {
      ElMessage.success('message')
    }
    const test2 = (_) => {
      ElMessageBox.confirm(
        'ElMessageBox',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        },
      )
    }
    
    const __returned__ = { loading, test1, test2, ref, get ElMessage() { return ElMessage }, get ElMessageBox() { return ElMessageBox } }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
    }
    
    }
    import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, resolveDirective as _resolveDirective, openBlock as _openBlock, createBlock as _createBlock, withDirectives as _withDirectives, Fragment as _Fragment, createElementBlock as _createElementBlock } from "vue"
    
    function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_el_button = _resolveComponent("el-button")
      const _component_el_config_provider = _resolveComponent("el-config-provider")
      const _directive_loading = _resolveDirective("loading")
    
      return (_openBlock(), _createElementBlock(_Fragment, null, [
        _createVNode(_component_el_config_provider, { namespace: "ep" }, {
          default: _withCtx(() => [
            _createVNode(_component_el_button, { onClick: $setup.test1 }, {
              default: _withCtx(() => [
                _createTextVNode(" el-message ")
              ]),
              _: 1 /* STABLE */
            }),
            _createVNode(_component_el_button, { onClick: $setup.test2 }, {
              default: _withCtx(() => [
                _createTextVNode(" el-messageBox ")
              ]),
              _: 1 /* STABLE */
            }),
            _withDirectives((_openBlock(), _createBlock(_component_el_button, null, {
              default: _withCtx(() => [
                _createTextVNode(" loading... ")
              ]),
              _: 1 /* STABLE */
            })), [
              [_directive_loading, $setup.loading]
            ])
          ]),
          _: 1 /* STABLE */
        }),
        _createVNode($setup["ElMessage"])
      ], 64 /* STABLE_FRAGMENT */))
    }
    
    
    _sfc_main.__hmrId = "7a7a37b1"
    typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
    import.meta.hot.accept(mod => {
      if (!mod) return
      const { default: updated, _rerender_only } = mod
      if (_rerender_only) {
        __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
      } else {
        __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
      }
    })
    import _export_sfc from 'plugin-vue:export-helper'
    export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"/Users/hejian/Documents/Github/unplugin-vue-components/examples/vite-vue3/src/App.vue"]])
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
