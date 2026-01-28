import type { Sort } from 'tinyglobby'
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

interface SortType {
  name: string
  initialDirs: string[]
  sort?: Sort
  globsExclude?: string[]
}

const globsExclude = [
  'src/components/*.vue',
  'src/components/*.md',
  'src/components/book/**/*.vue',
  'src/components/book/**/*.vue',
  'src/components/collapse/**/*.vue',
  'src/components/collapse/**/*.md',
  'src/components/global/**/*.vue',
  'src/components/global/**/*.vue',
  'src/components/sort/**/*.vue',
  'src/components/sort/**/*.md',
  'src/components/kebab-case/**/*.vue',
  'src/components/kebab-case/**/*.md',
  'src/components/kebab-sort/**/*.vue',
  'src/components/kebab-sort/**/*.md',
  'src/components/ui/**/*.vue',
  'src/components/ui/**/*.md',
]

describe('sort', () => {
  const cases: SortType[] = [
    {
      name: 'ascending',
      sort: 'asc',
      initialDirs: ['src/components/ui', 'src/components/book'],
    },
    {
      name: 'custom ascending',
      sort: (a: string, b: string) => a.localeCompare(b),
      initialDirs: ['src/components/ui', 'src/components/book'],
    },
    {
      name: 'descending',
      sort: 'desc',
      initialDirs: ['src/components/ui', 'src/components/book'],
    },
    {
      name: 'custom descending',
      sort: (a: string, b: string) => b.localeCompare(a),
      initialDirs: ['src/components/ui', 'src/components/book'],
    },
    {
      name: 'pattern (sort-a then sort-b)',
      sort: 'pattern',
      // changed sort to test it is working
      initialDirs: ['src/components/sort-a', 'src/components/sort-b'],
    },
    {
      name: 'pattern (sort-b then sort-a)',
      sort: 'pattern',
      // changed sort to test it is working
      initialDirs: ['src/layer-components/sort-b', 'src/components/sort-a'],
    },
    {
      name: 'pattern ascending',
      sort: 'pattern-asc',
      // changed sort to test it is working
      initialDirs: ['src/layer-components/sort-b', 'src/components/sort-a'],
    },
    {
      name: 'pattern descending',
      sort: 'pattern-desc',
      // changed sort to test it is working
      initialDirs: ['src/components/sort-a', 'src/layer-components/sort-b'],
    },
    {
      name: 'all pattern ascending',
      sort: 'pattern-asc',
      // changed sort to test it is working
      initialDirs: ['src/layer-components', 'src/components'],
      globsExclude,
    },
    {
      name: 'all pattern descending',
      sort: 'pattern-desc',
      // changed sort to test it is working
      initialDirs: ['src/components', 'src/layer-components'],
      globsExclude,
    },
  ]

  cases.forEach(({
    name,
    sort,
    initialDirs,
    globsExclude,
  }) => {
    it(`sort ${name} works`, async () => {
      const ctx = new Context({
        dirs: initialDirs,
        sort,
        globsExclude,
      })
      ctx.setRoot(root)
      ctx.searchGlob()

      expect(cleanup(ctx.componentNameMap)).toMatchSnapshot()
    })
  })
})
