import { describe, expect, it } from 'vitest'
import { Context } from '../src/core/context'
import { stringifyComponentImport } from '../src/core/utils'

describe('stringifyComponentImport', () => {
  it('importName', async() => {
    const ctx = new Context({})
    expect(
      stringifyComponentImport({
        name: 'Test',
        path: 'test',
        importName: 'a',
      }, ctx),
    ).toMatchSnapshot()
  })

  it('plain css sideEffects', async() => {
    const ctx = new Context({})
    expect(
      stringifyComponentImport({
        name: 'Test',
        path: 'test',
        sideEffects: 'test.css',
      }, ctx),
    ).toMatchSnapshot()
  })

  it('multiple sideEffects', async() => {
    const ctx = new Context({})
    expect(
      stringifyComponentImport({
        name: 'Test',
        path: 'test',
        sideEffects: [
          'test.css',
          { name: 'css', path: 'test2.css' },
        ],
      }, ctx),
    ).toMatchSnapshot()
  })
})
