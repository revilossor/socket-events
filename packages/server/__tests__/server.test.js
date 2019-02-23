const express = require('express')

const mockHealthcheckRouter = () => {}

jest.mock('../lib/routers/healthcheck', () => mockHealthcheckRouter)

let server

beforeAll(() => {
  express.application.listen = jest.fn()
  express.application.use = jest.fn()
  server = require('../lib/server')
})

it('uses the healthcheck router on /healthcheck', () => {
  expect(express.application.use).toHaveBeenCalledWith('/healthcheck', mockHealthcheckRouter)
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
