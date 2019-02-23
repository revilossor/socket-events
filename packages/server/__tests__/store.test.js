const handlers = {}
const mockMongoose = {
  connection: {
    on: jest.fn((id, handler) => { handlers[id] = handler }),
    once: jest.fn((id, handler) => { handlers[id] = handler })
  },
  connect: jest.fn(),
  disconnect: jest.fn()
}
const uri = 'mongodb://store:27017/server'

jest.mock('mongoose', () => mockMongoose)

let store

beforeAll(() => {
  console.log = jest.fn()
  console.error = jest.fn()
  store = require('../lib/store')
})

describe('connects', () => {
  it('with the correct uri', () => {
    expect(mockMongoose.connect).toHaveBeenCalledWith(uri, expect.anything())
  })
  it('auto reconnects', () => {
    expect(mockMongoose.connect).toHaveBeenCalledWith(expect.anything(), {
      server: expect.objectContaining({
        auto_reconnect: true
      })
    })
  })
})

it('returns a promise', () => {
  expect(store).toBeInstanceOf(Promise)
})

describe('when connection is open', () => {
  beforeAll(() => {
    console.log.mockClear()
    handlers.open()
  })

  it('logs', () => {
    expect(console.log).toHaveBeenCalledWith(`connection opened!`)
  })

  it('promise is resolved', () =>
    store.then(() => expect(true).toBe(true))
  )
})

it('logs when connecting', () => {
  console.log.mockClear()
  expect(handlers.connecting).toBeDefined()
  handlers.connecting()
  expect(console.log).toHaveBeenCalledWith(`connecting to ${uri}`)
})

it('logs when connected', () => {
  console.log.mockClear()
  expect(handlers.connected).toBeDefined()
  handlers.connected()
  expect(console.log).toHaveBeenCalledWith(`connected!`)
})

it('logs when reconnected', () => {
  console.log.mockClear()
  expect(handlers.reconnected).toBeDefined()
  handlers.reconnected()
  expect(console.log).toHaveBeenCalledWith(`reconnected!`)
})

describe('on error', () => {
  const error = new Error('mock error')

  beforeAll(() => {
    console.error.mockClear()
    mockMongoose.disconnect.mockClear()
    handlers.error(error)
  })

  it('error logs', () => {
    expect(console.error).toHaveBeenCalledWith(`error connecting: ${error}`)
  })

  it('disconnects', () => {
    expect(mockMongoose.disconnect).toHaveBeenCalled()
  })
})

describe('on disconnect', () => {
  beforeAll(() => {
    console.log.mockClear()
    mockMongoose.connect.mockClear()
    handlers.disconnected()
  })

  it('logs', () => {
    expect(console.log).toHaveBeenCalledWith(`disconnected!`)
  })

  describe('connects again', () => {
    it('with the correct uri', () => {
      expect(mockMongoose.connect).toHaveBeenCalledWith(uri, expect.anything())
    })
    it('auto reconnects', () => {
      expect(mockMongoose.connect).toHaveBeenCalledWith(expect.anything(), {
        server: expect.objectContaining({
          auto_reconnect: true
        })
      })
    })
  })
})
