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
})
