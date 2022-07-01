import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { describe, expect, test } from 'vitest'
import type { ComponentResolver } from '../src'
import { Context } from '../src/core/context'
import { getDeclaration } from '../src/core/declaration'

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
})
