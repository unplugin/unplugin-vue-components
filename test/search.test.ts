import { relative, resolve } from 'pathe'
import { describe, expect, it, onTestFailed } from 'vitest'
import { Context } from '../src/core/context'

const root = resolve(__dirname, '../examples/vite-vue3')

function cleanup(data: any) {
  return Object.values(data).map((e: any) => {
    delete e.absolute
    e.from = relative(root, e.from).replace(/\\/g, '/')
    return e
  }).sort((a, b) => (a.as as string).localeCompare(b.as))
}

describe('search', () => {
  it('should work', async () => {
    const ctx = new Context({})
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })

  it('should with namespace', async () => {
    const ctx = new Context({
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })

  it('should with namespace & collapse', async () => {
    const ctx = new Context({
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      globalNamespaces: ['global'],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
  })

  it('should globs exclude work', () => {
    const ctx = new Context({
      globs: [
        'src/components/*.vue',
        '!src/components/ComponentA.vue',
      ],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap).map(i => i.as)).not.toEqual(expect.arrayContaining(['ComponentA']))
  })

  it('should globs exclude work with dirs', () => {
    const ctx = new Context({
      dirs: [
        'src/components',
        '!src/components/book',
      ],
    })

    onTestFailed(() => {
      console.error('resolved options')
      console.error(ctx.options)
    })

    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap).map(i => i.as))
      .not
      .contain('Book')
  })

  it('should excludeNames', () => {
    const ctx = new Context({
      dirs: ['src/components'],
      excludeNames: ['Book'],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(cleanup(ctx.componentNameMap).map(i => i.as)).not.toEqual(expect.arrayContaining(['Book']))
  })
})

describe('allowOverrides', () => {
  const root = resolve(__dirname, 'fixtures/override')

  function from(ctx: Context, name: string) {
    return relative(root, ctx.componentNameMap[name].from)
  }

  it('should let later dirs override earlier ones', () => {
    const ctx = new Context({
      dirs: ['base', 'theme', 'user'],
      allowOverrides: true,
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(from(ctx, 'Button')).toBe('user/Button.vue')
    expect(from(ctx, 'Badge')).toBe('base/Badge.vue')
  })

  it('should follow globs order rather than path order', () => {
    const ctx = new Context({
      globs: ['user/*.vue', 'theme/*.vue', 'base/*.vue'],
      allowOverrides: true,
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(from(ctx, 'Button')).toBe('base/Button.vue')
  })

  it('should keep globs order when a lower priority component is added later', () => {
    const ctx = new Context({
      dirs: ['base', 'theme', 'user'],
      allowOverrides: true,
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    // simulate HMR: a lower priority file is removed and added back after the initial scan
    const theme = resolve(root, 'theme/Button.vue')
    ctx.removeComponents(theme)
    ctx.addComponents(theme)

    expect(from(ctx, 'Button')).toBe('user/Button.vue')
  })

  it('should keep the first dir when overrides are not allowed', () => {
    const ctx = new Context({
      dirs: ['user', 'theme', 'base'],
    })
    ctx.setRoot(root)
    ctx.searchGlob()

    expect(from(ctx, 'Button')).toBe('user/Button.vue')
  })
})
