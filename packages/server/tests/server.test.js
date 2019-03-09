const express = require('express')

const mockHealthcheckRouter = () => {}
const mockEventRouter = () => {}

jest.mock('../lib/routers/healthcheck', () => mockHealthcheckRouter)
jest.mock('../lib/routers/event', () => mockEventRouter)

let server

beforeAll(() => {
  express.application.listen = jest.fn()
  express.application.use = jest.fn()
  server = require('../lib/server')
})

it('uses the healthcheck router on /healthcheck', () => {
  expect(express.application.use).toHaveBeenCalledWith('/healthcheck', mockHealthcheckRouter)
})

it('uses the event router on /event', () => {
  expect(express.application.use).toHaveBeenCalledWith('/event', mockEventRouter)
})

describe('start', () => {
  const options = {
    port: 'the moon'
  }

  beforeAll(() => {
    server.start(options)
  })

  it('listens on the port specified', () => {
    expect(express.application.listen).toHaveBeenCalledWith(options.port)
  })
})
