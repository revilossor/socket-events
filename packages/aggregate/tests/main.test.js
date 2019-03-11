let main

let Aggregate

const mockSocket = {
  mock: 'socket'
}
const mockIo = jest.fn(() => mockSocket)

beforeAll(() => {
  jest.mock('socket.io-client', () => mockIo)
  Aggregate = require('../src/Aggregate').default
  main = require('../src/main').default
})

const url = 'url'
const id = 'id'

it('exports a function', () => {
  expect(main).toBeInstanceOf(Function)
})

describe('when the function is called with a url', () => {
  let returned

  beforeAll(() => {
    returned = main(url)
  })

  it('returns a function', () => {
    expect(returned).toBeInstanceOf(Function)
  })

  describe('when the returned function is called with an id', () => {
    let instance

    beforeAll(() => {
      instance = returned(id)
    })

    it('returns an Aggregate instance', () => {
      expect(instance).toBeInstanceOf(Aggregate)
    })

    it('has the right url', () => {
      expect(instance.url).toBe(url)
    })

    it('has the right id', () => {
      expect(instance.id).toBe(id)
    })
  })
})
