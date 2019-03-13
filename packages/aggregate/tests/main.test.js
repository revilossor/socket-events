let main
let ConnectedAggregate

const mockIo = () => {}
const mockSocket = jest.fn(() => mockIo)
const id = 'id'
const url = 'mockUrl'

beforeAll(() => {
  jest.mock('socket.io-client', () => mockSocket)
  main = require('../src/main').default
  ConnectedAggregate = require('../src/ConnectedAggregate').default
})

it('exports a function', () => {
  expect(main).toBeInstanceOf(Function)
})

describe('when the function is called with a socket and a url', () => {
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
      expect(instance).toBeInstanceOf(ConnectedAggregate)
    })

    it('inits the socket with the right url', () => {
      expect(mockSocket).toHaveBeenCalledWith(`${url}/socket`)
    })

    it('has the right socket', () => {
      expect(instance.socket).toBe(mockIo)
    })

    it('has the right id', () => {
      expect(instance.id).toBe(id)
    })
  })
})
