import path from 'pathe'
import { describe, expect, it } from 'vitest'
import { Context } from '../src/core/context'

const root = path.resolve(__dirname, '../examples/vite-vue3')

function cleanup(data: any) {
  return Object.values(data).map((e: any) => {
    delete e.absolute
    e.from = path.relative(root, e.from).replace(/\\/g, '/')
    return e
  }).sort((a, b) => (a.as as string).localeCompare(b.as))
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
