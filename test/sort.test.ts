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
  const cases = [
    {
      name: 'ascending',
      sortByGlob: undefined,
      sortFn: (a: string, b: string) => a.localeCompare(b),
      initialDirs: ['src/components/ui'],
      filesToAdd: ['src/components/book/index.vue'],
      withSort: true,
    },
    {
      name: 'descending',
      sortByGlob: undefined,
      sortFn: (a: string, b: string) => b.localeCompare(a),
      initialDirs: ['src/components/book'],
      filesToAdd: [
        'src/components/ui/button.vue',
        'src/components/ui/nested/checkbox.vue',
      ],
      withSort: true,
    },
    {
      name: 'compileGlobs disabled',
      sortByGlob: undefined,
      sortFn: () => -1,
      initialDirs: ['src/components/ui', 'src/components/book'],
      filesToAdd: [],
      withSort: false,
    },
    {
      name: 'compileGlobs enabled',
      sortByGlob: true,
      sortFn: () => -1,
      initialDirs: ['src/components/ui', 'src/components/book'],
      filesToAdd: [],
      withSort: false,
    },
  ]

  cases.forEach(({
    name,
    sortFn,
    initialDirs,
    filesToAdd,
    withSort,
    sortByGlob,
  }) => {
    it(`sort ${name} works`, async () => {
      const ctx = new Context({
        dirs: withSort ? initialDirs : undefined,
        globs: withSort ? undefined : initialDirs.map(i => `${i}/**/*.vue`),
        sortByGlob: sortByGlob === true ? true : undefined,
        * sort(_options, files): Generator<string, undefined, void> {
          if (withSort) {
            yield* files.sort(sortFn)
          }
          else {
            yield* files
          }
        },
      })
      ctx.setRoot(root)
      ctx.searchGlob()

      expect(cleanup(ctx.componentNameMap)).toMatchSnapshot(filesToAdd.length > 0 ? 'initial' : undefined)

      if (filesToAdd.length > 0) {
        for (const file of filesToAdd) {
          ctx.addComponents(resolve(root, file).replace(/\\/g, '/'))
        }

        expect(cleanup(ctx.componentNameMap)).toMatchSnapshot('updated')
      }
    })
  })
})
