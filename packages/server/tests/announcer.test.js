const announcer = require('../lib/announcer')

let resolvePromise
const promise = new Promise(resolve => { resolvePromise = resolve })
const message = 'the moon'

it('prints the message when the promise resolves', async () => {
  console.log = jest.fn()
  announcer(promise, message)
  await resolvePromise()
  expect(console.log).toHaveBeenCalledWith(message)
})

it('returns a promise', () => {
  expect(announcer(promise, message)).toBeInstanceOf(Promise)
})
