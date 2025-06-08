import type { ComponentInfo, ComponentResolver, DtsDeclarationType } from '../src'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { Context } from '../src/core/context'
import { getDeclarations, parseDeclaration } from '../src/core/declaration'

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
  it('getDeclaration', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
    })
    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('getDeclaration - function expression', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: () => 'test.d.ts',
    })

    const filepath = path.resolve(__dirname, '../test.d.ts')

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)

    expect(Object.keys(declarations ?? {})).toEqual([filepath])
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('getDeclaration - return absolute path', async () => {
    const filepath = path.resolve(__dirname, 'test.d.ts')

    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: () => filepath,
    })

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)

    expect(Object.keys(declarations ?? {})).toEqual([filepath])
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('getDeclaration - return false', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: () => false,
    })

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')
    const declarations = await getDeclarations(ctx)
    expect(declarations).toBeUndefined()
  })

  it('getDeclaration - multiple files', async () => {
    const fn = vi.fn().mockImplementation((_info: ComponentInfo, type: DtsDeclarationType) => {
      return type === 'component' ? 'test.d.ts' : 'test2.d.ts'
    })

    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: fn,
    })

    const filepath = path.resolve(__dirname, '../test.d.ts')
    const filepath2 = path.resolve(__dirname, '../test2.d.ts')

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`

    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)

    expect(fn).toBeCalledTimes(4)
    expect(fn).toBeCalledWith({ as: 'TestComp', from: 'test/component/TestComp' } satisfies ComponentInfo, 'component')
    expect(fn).toBeCalledWith({ as: 'vLoading', from: 'test/directive/Loading' } satisfies ComponentInfo, 'directive')
    expect(fn).toBeCalledWith({ from: 'vue-router', name: 'RouterView', as: 'RouterView' } satisfies ComponentInfo, 'component')
    expect(fn).toBeCalledWith({ from: 'vue-router', name: 'RouterLink', as: 'RouterLink' } satisfies ComponentInfo, 'component')

    expect(Object.keys(declarations ?? {})).toEqual([filepath, filepath2])
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('getDeclaration - filter', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: (_, type) => type === 'component' ? 'test.d.ts' : false,
    })

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)

    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('writeDeclaration', async () => {
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

  it('writeDeclaration - keep unused', async () => {
    const filepath = path.resolve(__dirname, 'tmp/dts-keep-unused.d.ts')
    await writeFile(
      filepath,
      `
declare module 'vue' {
  export interface GlobalComponents {
    SomeComp: typeof import('test/component/SomeComp')['default']
    TestComp: typeof import('test/component/OldComp')['default']
  }
  export   interface   GlobalDirectives{
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

  it('writeDeclaration - multiple files', async () => {
    const filepath = path.resolve(__dirname, 'tmp/dts-test.d.ts')
    const filepath2 = path.resolve(__dirname, 'tmp/dts-test2.d.ts')

    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: (_, type) => (type === 'component' ? filepath : filepath2),
    })

    const code = `
const _component_test_comp = _resolveComponent("test-comp")
const _directive_loading = _resolveDirective("loading")`
    await ctx.transform(code, '')
    await ctx._generateDeclaration()

    expect(await readFile(filepath, 'utf-8')).matchSnapshot()
    expect(await readFile(filepath2, 'utf-8')).matchSnapshot()
  })

  it('components only', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: 'test.d.ts',
    })
    const code = 'const _component_test_comp = _resolveComponent("test-comp")'
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('vue 2.7 components only', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: 'test.d.ts',
      version: 2.7,
    })
    const code = 'const _component_test_comp = _c("test-comp")'
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('directive only', async () => {
    const ctx = new Context({
      resolvers: resolver,
      directives: true,
      dts: 'test.d.ts',
      types: [],
    })
    const code = 'const _directive_loading = _resolveDirective("loading")'
    await ctx.transform(code, '')

    const declarations = await getDeclarations(ctx)
    expect(Object.values(declarations ?? {})).toMatchSnapshot()
  })

  it('parseDeclaration', async () => {
    const code = `
/* eslint-disable */
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    ComponentB: typeof import('./src/components/ComponentB.vue')['default']
    ComponentC: typeof import('./src/components/component-c.vue')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })

  it('parseDeclaration - has icon component like <IMdi:diceD12>', async () => {
    const code = `
/* eslint-disable */
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    'IMdi:diceD12': typeof import('~icons/mdi/dice-d12')['default']
    IMdiLightAlarm: typeof import('~icons/mdi-light/alarm')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })

  it('parseDeclaration - with directives', async () => {
    const code = `
/* eslint-disable */
// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    ComponentA: typeof import('./src/components/ComponentA.vue')['default']
    'IMdi:diceD12': typeof import('~icons/mdi/dice-d12')['default']
    IMdiLightAlarm: typeof import('~icons/mdi-light/alarm')['default']
  }

  export interface GlobalDirectives {
    vDirective: typeof import('foo')
    vLoading: typeof import('test/directive/Loading')['default']
    vSome: typeof import('test/directive/Some')['default']
  }
}`

    const imports = parseDeclaration(code)
    expect(imports).matchSnapshot()
  })
})
