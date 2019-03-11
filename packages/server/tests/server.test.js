const express = require('express')

const mockHealthcheckRouter = () => {}
const mockEventRouter = () => {}

const mockServer = {
  listen: jest.fn()
}
const mockHttp = {
  createServer: jest.fn(() => mockServer)
}
const mockOnHandlers = {}
const mockIo = {
  on: jest.fn((key, func) => { mockOnHandlers[key] = func })
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

// describe('socket.io', () => {
//   it('creates an http server', () => {
//     expect(mockHttp.createServer).toHaveBeenCalled()
//   })
//   it('creates an io instance', () => {
//     expect(mockSocketIo).toHaveBeenCalledWith(mockServer)
//   })
//   it('listens for connections', () => {
//     expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function))
//   })
//   describe('on client connection', () => {
//     beforeAll(() => {
//       console.log = jest.fn()
//       mockOnHandlers.connection()
//     })
//     it('logs', () => {
//       expect(console.log).toHaveBeenCalledWith('user connected!')
//     })
//   })
// })

describe('start', () => {
  const options = {
    port: 'the moon'
  }

  beforeAll(() => {
    server.start(options)
  })

  it('http server listens on the port specified', () => {
    expect(mockServer.listen).toHaveBeenCalledWith(options.port)
  })
})
