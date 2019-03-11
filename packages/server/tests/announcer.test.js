const announcer = require('../lib/announcer')

let resolvePromise
const getPromise = () => new Promise(resolve => { resolvePromise = resolve })
const message = 'the moon'

beforeAll(() => {
  console.log = jest.fn()
})

it('prints the message when the promise resolves', async () => {
  announcer(getPromise(), message)
  await resolvePromise()
  expect(console.log).toHaveBeenCalledWith(message)
})

it('returns a promise', () => {
  expect(announcer(getPromise(), message)).toBeInstanceOf(Promise)
})

it('wrapped resolves with same as input promise', async () => {
  const wrapped = announcer(getPromise(), message)
  const thing = 1
  resolvePromise(thing)
  const result = await wrapped
  expect(result).toBe(thing)
})
