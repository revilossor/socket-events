let Aggregate

const mockSocket = {
  mock: 'socket'
}
const mockIo = jest.fn(() => mockSocket)

beforeAll(() => {
  jest.mock('socket.io-client', () => mockIo)
  Aggregate = require('../src/Aggregate').default
})

describe('constructor', () => {
  const url = 'mock url'
  const id = 'mock id'

  let instance

  beforeAll(() => {
    instance = new Aggregate(url, id)
  })

  it('stores the url', () => {
    expect(instance.url).toBe(url)
  })

  it('stores the id', () => {
    expect(instance.id).toBe(id)
  })

  describe('opens a socket', () => {
    it('with the url', () => {
      expect(mockIo).toHaveBeenCalledWith(url)
    })
    it('stores it', () => {
      expect(instance.socket).toBe(mockSocket)
    })
  })

  it('inits state to null', () => {
    expect(instance.state).toBe(null)
  })
})

// describe('register', () => {
//   // register an event handler
// })
//
// describe('push', () => {
//   // adds events
// })
//
// describe('play', () => {
//   // update version to latest and start listening for events
// })
//
// describe('pause', () => {
//   // stop listening for events
// })
//
// describe('pause', () => {
//   // stop listening for events
// })
//
// describe('skip', () => {
//   // inits to a version
// })
//
// describe('forward', () => {
//   // inits to a version + 1
// })
//
// describe('back', () => {
//   // inits to a version - 1
// })
