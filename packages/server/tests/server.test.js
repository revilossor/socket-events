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

const mockSockets = {
  use: jest.fn()
}

let server

beforeAll(() => {
  jest.mock('http', () => mockHttp)
  jest.mock('../lib/sockets', () => mockSockets)
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

it('uses sockets in the /socket namespace', () => {
  expect(mockSockets.use).toHaveBeenCalledWith('/socket', mockServer)
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
