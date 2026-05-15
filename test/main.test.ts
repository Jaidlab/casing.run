import {expect, test} from 'bun:test'

const {default: casingRun} = await import('#src/main.ts')

test('should run', () => {
  const result = casingRun()
  expect(result).toBe('casing.run') // TODO Test actual functionality
})
