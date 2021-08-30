import { resolve } from 'path'
import { Context } from '../src/core/context'

const root = resolve(__dirname, '../examples/vite-vue3')

function cleanup(data: any) {
  return Object.values(data).map((e: any) => {
    delete e.absolute
    e.path = e.path.replace(root, '')
    return e
  }).sort((a, b) => (a.name as string).localeCompare(b.name))
}

describe('search', () => {
  it('should work', async() => {
    const ctx = new Context({})
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })

  it('should with namespace', async() => {
    const ctx = new Context({
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })
})
