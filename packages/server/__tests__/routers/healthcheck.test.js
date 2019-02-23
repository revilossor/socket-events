const request = require('supertest')
const express = require('express')

let app

beforeAll(() => {
  jest.spyOn(express.Router, 'route')
  app = express()
  app.use('/', require('../../lib/routers/healthcheck'))
})

it('sets a route for /', () => {
  expect(express.Router.route).toHaveBeenCalledWith('/')
})

describe('GET /', () => {
  let response

  beforeAll(() => request(app)
    .get('/')
    .then(res => {
      response = res
      return response
    })
  )

  it('status is 200', () => {
    expect(response.statusCode).toBe(200)
  })

  it('text is "OK"', () => {
    expect(response.text).toBe('OK')
  })
})
