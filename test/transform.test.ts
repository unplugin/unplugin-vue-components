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

  it('vue2 transform with jsx should work', async () => {
    const code = `
    export default {
      render(){
        return h("test-comp", {
        directives: [
          { name: "loading", rawName: "v-loading", value: 123, expression: "123" }
        ]
      })
      }
    }
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
      transformer: 'vue3',
      transformerUserResolveFunctions: false,
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot('no-user-resolve')

    ctx = new Context({
      resolvers: [resolver],
      transformer: 'vue3',
      transformerUserResolveFunctions: true,
      directives: true,
    })
    ctx.sourcemap = false
    expect(await ctx.transform(code, '')).toMatchSnapshot('with-user-resolve')
  })
})

describe('component and directive as same name', () => {
  it('vue2 transform should work', async () => {
    const code = `
    var render = function () {
      var _vm = this
      var _h = _vm.$createElement
      var _c = _vm._self._c || _h
      return _c("loading", {
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

  it('vue2.7 transform should work', async () => {
    const code = `
    import { defineComponent as _defineComponent } from "vue";
    const _sfc_main = /* @__PURE__ */ _defineComponent({
      __name: "App",
      setup(__props) {
        return { __sfc: true };
      }
    });
    var _sfc_render = function render() {
      var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
      return _c("div", { directives: [{ name: "loading", rawName: "v-loading", value: 123, expression: "123" }] }, [], 1);
    };
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
      transformer: 'vue3',
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
