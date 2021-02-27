import { resolve } from 'path'
import { Context } from '../src/context'

function cleanup(data: any) {
  return Object.values(data).map((e: any) => {
    delete e.absolute
    return e
  }).sort((a, b) => (a.name as string).localeCompare(b.name))
}

describe('search', () => {
  it('should work', async() => {
    const ctx = new Context({}, { root: resolve(__dirname, '../examples/vue3') } as any)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })

  it('should with namespace', async() => {
    const ctx = new Context({
      directoryAsNamespace: true,
    }, { root: resolve(__dirname, '../examples/vue3') } as any)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })
})
