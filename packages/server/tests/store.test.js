const handlers = {}
const mockMongoose = {
  connection: {
    on: jest.fn((id, handler) => { handlers[id] = handler }),
    once: jest.fn((id, handler) => { handlers[id] = handler })
  },
  connect: jest.fn(),
  disconnect: jest.fn()
}
const uri = 'mongodb://store:27017/events'

jest.mock('mongoose', () => mockMongoose)

jest.useFakeTimers()

let store

beforeAll(() => {
  console.log = jest.fn()
  store = require('../lib/store')
})

afterAll(() => {
  jest.clearAllTimers()
})

describe('connect', () => {
  let returnedThing

  beforeAll(() => {
    returnedThing = store.connect(uri)
  })

  it('returns a promise', () => {
    expect(returnedThing).toBeInstanceOf(Promise)
  })

  describe('connects', () => {
    it('with the correct uri', () => {
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri, expect.anything())
    })
    it('uses the new url parser option', () => {
      expect(mockMongoose.connect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          useNewUrlParser: true
        })
      )
    })
  })

  describe('when connection is open', () => {
    beforeAll(async () => {
      console.log.mockClear()
      handlers.open()
      await returnedThing
    })

    it('logs', () => {
      expect(console.log).toHaveBeenCalledWith(`connection opened!`)
    })

    it('promise is resolved', () =>
      returnedThing.then(() => expect(true).toBe(true))
    )
  })
})

describe('on error', () => {
  const error = new Error('mock error')

  beforeAll(() => {
    mockMongoose.disconnect.mockClear()
    handlers.error(error)
  })

  it('disconnects', () => {
    expect(mockMongoose.disconnect).toHaveBeenCalled()
  })
})

describe('on disconnect', () => {
  beforeAll(() => {
    mockMongoose.connect.mockClear()
    handlers.disconnected()
  })

  it('clears timeout', () => {
    expect(clearTimeout).toHaveBeenCalledWith(0)
  })

  describe('connects again', () => {
    it('after 1 second', () => {
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    })

    it('with the correct uri', () => {
      jest.runAllTimers()
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri, expect.anything())
    })

    it('uses the new url parser option', () => {
      expect(mockMongoose.connect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          useNewUrlParser: true
        })
      )
    })
  })
})
