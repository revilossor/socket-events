const express = require('express')
let server

beforeAll(() => {
  express.application.listen = jest.fn()
  server = require('../lib/server')
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
