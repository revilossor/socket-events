import main from '../src/main'
import ConnectedAggregate from '../src/ConnectedAggregate'

const mockIo = () => {}
const mockSocket = jest.fn(() => mockIo)
const id = 'id'
const url = 'mockUrl'

it('exports a function', () => {
  expect(main).toBeInstanceOf(Function)
})

describe('when the function is called with a socket and a url', () => {
  let returned

  beforeAll(() => {
    returned = main(mockSocket, url)
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
