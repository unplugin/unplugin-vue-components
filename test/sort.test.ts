import { relative, resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { Context } from '../src/core/context'

const root = resolve(__dirname, '../examples/vite-vue3')

function cleanup(data: any) {
  return Object.values(data).map((e: any) => {
    delete e.absolute
    e.from = relative(root, e.from).replace(/\\/g, '/')
    return e
  })
}

describe('sort', () => {
  it('sort ascending works', async () => {
    const ctx = new Context({
      dirs: ['src/components/ui'],
      sort(_, files) {
        return files.toSorted((a, b) => a.localeCompare(b))
      },
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchInlineSnapshot(`
      [
        {
          "as": "Button",
          "from": "src/components/ui/button.vue",
        },
        {
          "as": "Checkbox",
          "from": "src/components/ui/nested/checkbox.vue",
        },
      ]
    `)

    // simulate the watcher adding a component
    ctx.addComponents(resolve(root, 'src/components/book/index.vue').replace(/\\/g, '/'))

    expect(cleanup(ctx.componentNameMap)).toMatchInlineSnapshot(`
      [
        {
          "as": "Book",
          "from": "src/components/book/index.vue",
        },
        {
          "as": "Button",
          "from": "src/components/ui/button.vue",
        },
        {
          "as": "Checkbox",
          "from": "src/components/ui/nested/checkbox.vue",
        },
      ]
    `)
  })

  it('sort descending works', async () => {
    const ctx = new Context({
      dirs: ['src/components/book'],
      sort(_, files) {
        return files.toSorted((a, b) => b.localeCompare(a))
      },
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchInlineSnapshot(`
      [
        {
          "as": "Book",
          "from": "src/components/book/index.vue",
        },
      ]
    `)

    // simulate the watcher adding some components
    ctx.addComponents(resolve(root, 'src/components/ui/button.vue').replace(/\\/g, '/'))
    ctx.addComponents(resolve(root, 'src/components/ui/nested/checkbox.vue').replace(/\\/g, '/'))

    expect(cleanup(ctx.componentNameMap)).toMatchInlineSnapshot(`
      [
        {
          "as": "Checkbox",
          "from": "src/components/ui/nested/checkbox.vue",
        },
        {
          "as": "Button",
          "from": "src/components/ui/button.vue",
        },
        {
          "as": "Book",
          "from": "src/components/book/index.vue",
        },
      ]
    `)
  })
})
