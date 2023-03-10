import { describe, expect, it } from 'vitest'
import { AntDesignVueResolver } from '../../src/resolvers'
import { Context } from '../../src/core/context'

describe('Ant Design Vue Resolver', () => {
  it('components and directives should be transformed', async () => {
    const code = `
    import { defineComponent as _defineComponent } from "vue";\n' +
    'import { message } from "ant-design-vue";\n' +
    'import { ElMessage } from "element-plus";\n' +
    'const _sfc_main = /* @__PURE__ */ _defineComponent({\n' +
    '  __name: "App",\n' +
    '  setup(__props, { expose }) {\n' +
    '    expose();\n' +
    '    const test1 = () => {\n' +
    '      ElMessage.success("message");\n' +
    '    };\n' +
    '    const handleClick = () => {\n' +
    '      message.success("\\u6D4B\\u8BD5 jsx \\u4F7F\\u7528 a-button \\u548C mesage");\n' +
    '    };\n' +
    '    const __returned__ = { test1, handleClick };\n' +
    '    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });\n' +
    '    return __returned__;\n' +
    '  }\n' +
    '});\n' +
    'import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from "vue";\n' +
    'const _withScopeId = (n) => (_pushScopeId("data-v-7a7a37b1"), n = n(), _popScopeId(), n);\n' +
    'const _hoisted_1 = { class: "block" };\n' +
    'function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {\n' +
    '  const _component_a_button = _resolveComponent("a-button");\n' +
    '  return _openBlock(), _createElementBlock("div", _hoisted_1, [\n' +
    '    _createVNode(_component_a_button, { onClick: $setup.handleClick }, {\n' +
    '      default: _withCtx(() => [\n' +
    '        _createTextVNode(" \\u70B9\\u6211 ")\n' +
    '      ]),\n' +
    '      _: 1\n' +
    '      /* STABLE */\n' +
    '    })\n' +
    '  ]);\n' +
    '}\n' +
    'import "/Users/hejian/Documents/Github/unplugin-vue-components/examples/vite-vue3/src/App.vue?vue&type=style&index=0&scoped=7a7a37b1&lang.css";\n' +
    '_sfc_main.__hmrId = "7a7a37b1";\n' +
    'typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);\n' +
    'import.meta.hot.accept((mod) => {\n' +
    '  if (!mod)\n' +
    '    return;\n' +
    '  const { default: updated, _rerender_only } = mod;\n' +
    '  if (_rerender_only) {\n' +
    '    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);\n' +
    '  } else {\n' +
    '    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);\n' +
    '  }\n' +
    '});\n' +
    'import _export_sfc from "\\0plugin-vue:export-helper";\n' +
    'export default /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7a7a37b1"], ["__file", "/Users/hejian/Documents/Github/unplugin-vue-components/examples/vite-vue3/src/App.vue"]]);\n
`

    const ctx = new Context({
      resolvers: [AntDesignVueResolver({})],
      transformer: 'vue3',
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot()
  })
})
