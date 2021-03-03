import { resolve } from 'path'
import { Context } from '../src/context'
import { addImports } from '../src/transforms/vue3'

describe('component info', () => {
  it('stylePath', async() => {
    const ctx = new Context({}, { root: resolve(__dirname, '../examples/vue3') } as any)
    const result: Array<string> = []
    addImports(ctx, {
      name: 'Test',
      path: 'test',
      stylePath: 'test.css',
    }, result, 'var1')
    expect(result).toMatchSnapshot()
  })
  it('stylePath as array', async() => {
    const ctx = new Context({}, { root: resolve(__dirname, '../examples/vue3') } as any)
    const result: Array<string> = []
    addImports(ctx, {
      name: 'Test',
      path: 'test',
      stylePath: ['test1.css', 'test2.css'],
    }, result, 'var1')
    expect(result).toMatchSnapshot()
  })
  it('importName', async() => {
    const ctx = new Context({}, { root: resolve(__dirname, '../examples/vue3') } as any)
    const result: Array<string> = []
    addImports(ctx, {
      name: 'Test',
      path: 'test',
      importName: 'customImportName',
    }, result, 'var1')
    expect(result).toMatchSnapshot()
  })
})
