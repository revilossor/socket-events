const express = require('express')

const mockHealthcheckRouter = () => {}
const mockEventRouter = () => {}

const mockError = Error('mock error')

let forceListenError = false
const mockServer = {
  listen: jest.fn((port, cb) => {
    forceListenError
      ? cb(mockError)
      : cb()
  })
}
const mockHttp = {
  createServer: jest.fn(() => mockServer)
}
const mockOnHandlers = {}
const mockInRoom = {
  emit: jest.fn()
}
const mockNamespace = {
  on: jest.fn((key, func) => { mockOnHandlers[key] = func }),
  join: jest.fn(),
  in: jest.fn(() => mockInRoom)
}
const mockIo = {
  of: jest.fn(() => mockNamespace)
}
const mockSocketIo = jest.fn(() => mockIo)

let server

beforeAll(() => {
  jest.mock('http', () => mockHttp)
  jest.mock('socket.io', () => mockSocketIo)
  jest.mock('../lib/routers/healthcheck', () => mockHealthcheckRouter)
  jest.mock('../lib/routers/event', () => mockEventRouter)
  express.application.listen = jest.fn()
  express.application.use = jest.fn()
  server = require('../lib/server')
})

describe('express app', () => {
  it('uses the healthcheck router on /healthcheck', () => {
    expect(express.application.use).toHaveBeenCalledWith('/healthcheck', mockHealthcheckRouter)
  })

  it('uses the event router on /event', () => {
    expect(express.application.use).toHaveBeenCalledWith('/event', mockEventRouter)
  })
})

describe('socket.io', () => {
  it('creates an http server', () => {
    expect(mockHttp.createServer).toHaveBeenCalled()
  })
  it('creates an io instance', () => {
    expect(mockSocketIo).toHaveBeenCalledWith(mockServer)
  })
  it('creates a /socket namespace', () => {
    expect(mockIo.of).toHaveBeenCalledWith('/socket')
  })
  it('listens for connections in namespace', () => {
    expect(mockNamespace.on).toHaveBeenCalledWith('connection', expect.any(Function))
  })
  describe('on client connection', () => {
    const aggregateId = 'aggregateId'

    beforeAll(() => {
      console.log = jest.fn()
      mockOnHandlers.connection(mockNamespace)
    })
    it('logs', () => {
      expect(console.log).toHaveBeenCalledWith('user connected!')
    })

    it('listens for aggregateId events', () => {
      expect(mockOnHandlers.aggregateId).toBeDefined()
    })
    describe('on aggregateId', () => {
      beforeAll(() => {
        mockOnHandlers.aggregateId(aggregateId)
      })

      it('logs', () => {
        expect(console.log).toHaveBeenCalledWith('join room ' + aggregateId)
      })

      it('joins the room', () => {
        expect(mockNamespace.join).toHaveBeenCalledWith(aggregateId)
      })
    })

    it('listens for push events', () => {
      expect(mockOnHandlers.push).toBeDefined()
    })
    describe('on push', () => {
      const mockEvent = {
        aggregateId,
        body: {
          event: 'mock event',
          data: 'mock data'
        }
      }

      beforeAll(() => {
        mockOnHandlers.push(mockEvent)
      })

      it('logs', () => {
        expect(console.log).toHaveBeenCalledWith('push event ' + JSON.stringify(mockEvent))
      })

      it('emits the event to all in room', () => {
        expect(mockNamespace.in).toHaveBeenCalledWith(aggregateId)
        expect(mockInRoom.emit).toHaveBeenCalledWith('push', mockEvent.body)
      })
    })

    it('listens for disconnections', () => {
      expect(mockOnHandlers.disconnect).toBeDefined()
    })
    describe('on disconnect', () => {
      beforeAll(() => {
        mockOnHandlers.disconnect(mockNamespace)
      })

      it('logs', () => {
        expect(console.log).toHaveBeenCalledWith('user disconnected')
      })
    })
  })
})

describe('start', () => {
  const options = {
    port: 'the moon'
  }

  beforeAll(async () => {
    await server.start(options)
  })

  it('http server listens on the port specified', () => {
    expect(mockServer.listen).toHaveBeenCalledWith(options.port, expect.anything())
  })

  describe('returns a promise', () => {
    it('resolves when listening', async () => {
      await expect(server.start(options)).resolves.toBeUndefined()
    })
    it('rejects when error listening', async () => {
      forceListenError = true
      await expect(server.start(options)).rejects.toEqual(mockError)
    })
  })
})
