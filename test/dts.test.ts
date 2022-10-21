import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { describe, expect, test } from 'vitest'
import type { ComponentResolver } from '../src'
import { Context } from '../src/core/context'
import { getDeclaration, parseDeclaration } from '../src/core/declaration'

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

describe('dts', () => {
  test('getDeclaration', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
    })
    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')

    const declarations = getDeclaration(ctx, 'test.d.ts')
    expect(declarations).toMatchSnapshot()
  })

  test('writeDeclaration', async () => {
    const filepath = path.resolve(__dirname, 'tmp/dts-test.d.ts')
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: filepath,
    })
    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')
    await ctx._generateDeclaration()

    expect(await readFile(filepath, 'utf-8')).matchSnapshot()
  })

  test('writeDeclaration - keep unused', async () => {
    const filepath = path.resolve(__dirname, 'tmp/dts-keep-unused.d.ts')
    await writeFile(
      filepath,
      `
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    SomeComp: typeof import('test/component/SomeComp')['default']
    TestComp: typeof import('test/component/OldComp')['default']
  }
  export   interface   ComponentCustomProperties{
    // with comment: b
    // a:
    vSome: typeof import('test/directive/Some')['default'];vDirective:typeof import('foo')
  }
}`,
      'utf-8',
    )
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: filepath,
    })
    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')
    await ctx._generateDeclaration(false)

    const contents = await readFile(filepath, 'utf-8')
    expect(contents).matchSnapshot()
    expect(contents).not.toContain('OldComp')
    expect(contents).not.toContain('comment')
    expect(contents).toContain('vSome')
  })

  test('components only', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
    })
    const code = 'const _component_test_comp = _resolveComponent("test-comp")'
    await ctx.transform(code, '')

    const declarations = getDeclaration(ctx, 'test.d.ts')
    expect(declarations).toMatchSnapshot()
  })

  test('components only vue2.7', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
    })
    ctx.options.vueVersion = '2.7.1'
    const code = 'const _component_test_comp = _resolveComponent("test-comp")'
    await ctx.transform(code, '')

    const declarations = getDeclaration(ctx, 'test.d.ts')
    expect(declarations).toMatchSnapshot()
  })

  test('directive only', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      types: [],
    })
    const code = 'const _directive_loading = _resolveDirective("loading")'
    await ctx.transform(code, '')

    const declarations = getDeclaration(ctx, 'test.d.ts')
    expect(declarations).toMatchSnapshot()
  })

  test('parseDeclaration', async () => {
    const code = `
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    ComponentB: typeof import('./src/components/ComponentB.vue')['default']
    ComponentC: typeof import('./src/components/component-c.vue')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })

  test('parseDeclaration - has icon component like <IMdi:diceD12>', async () => {
    const code = `
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    'IMdi:diceD12': typeof import('~icons/mdi/dice-d12')['default']
    IMdiLightAlarm: typeof import('~icons/mdi-light/alarm')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })

  test('parseDeclaration - with directives', async () => {
    const code = `
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    'IMdi:diceD12': typeof import('~icons/mdi/dice-d12')['default']
    IMdiLightAlarm: typeof import('~icons/mdi-light/alarm')['default']
  }

  export interface ComponentCustomProperties {
    vDirective: typeof import('foo')
    vLoading: typeof import('test/directive/Loading')['default']
    vSome: typeof import('test/directive/Some')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })
})
