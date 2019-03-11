const express = require('express')
const request = require('supertest')

let forceCreateRejection = false
let forceFindRejection = false
let forceCountRejection = false

const mockError = Error('mock error')

const mockCountResult = 42

const someResults = [
  { find: 'result' },
  { find: 'result' },
  { find: 'result' }
]
const noResults = []

const mockSavedEvent = { saved: 'event' }

let mockFindResult = someResults

const mockEvent = {
  create: jest.fn(() => new Promise((resolve, reject) => {
    forceCreateRejection
      ? reject(mockError)
      : resolve(mockSavedEvent)
  })),
  count: jest.fn(() => new Promise((resolve, reject) => {
    forceCountRejection
      ? reject(mockError)
      : resolve(mockCountResult)
  })),
  find: jest.fn(() => new Promise((resolve, reject) => {
    forceFindRejection
      ? reject(mockError)
      : resolve(mockFindResult)
  }))
}

const event = 'mock event'
const data = { some: 'data' }

const mockParserMiddleware = (req, res, next) => {
  req.body = { event, data }
  next()
}
const mockBodyParser = {
  json: jest.fn(() => mockParserMiddleware)
}

const aggregateId = 'aggregateId'
const version = '42'

let app

beforeAll(() => {
  jest.mock('../../lib/event', () => mockEvent)
  jest.mock('body-parser', () => mockBodyParser)
  jest.spyOn(express.Router, 'route')
  jest.spyOn(express.Router, 'use')
  console.error = jest.fn()
  app = express()
  app.use('/', require('../../lib/routers/event'))
})

it('parses json', () => {
  expect(mockBodyParser.json).toHaveBeenCalled()
  expect(express.Router.use).toHaveBeenCalledWith(mockParserMiddleware)
})

describe('/:id', () => {
  let response

  it('sets a route', () => {
    expect(express.Router.route).toHaveBeenCalledWith('/:id')
  })

  describe('GET', () => {
    const makeRequest = (query = '') => request(app)
      .get(query
        ? `/${aggregateId}?v=${query}`
        : `/${aggregateId}`
      )
      .then(res => {
        response = res
        return response
      })

    describe('with no querystring', () => {
      beforeAll(async () => makeRequest())

      it('finds all events for the aggregateId', () => {
        expect(mockEvent.find).toHaveBeenCalledWith(
          expect.objectContaining({
            aggregateId
          })
        )
      })

      it('doesnt have a version in the query', () => {
        const query = mockEvent.find.mock.calls[mockEvent.find.mock.calls.length - 1][0]

        expect(Object.keys(query)).not.toEqual(
          expect.arrayContaining([
            'version'
          ])
        )
      })

      it('status is 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('body is the results', () => {
        expect(response.body).toEqual(someResults)
      })

      describe('if there is an error finding events', () => {
        beforeAll(async () => {
          forceFindRejection = true
          await makeRequest()
        })
        afterAll(() => {
          forceFindRejection = false
          console.error.mockClear()
        })

        it('status is 500', () => {
          expect(response.statusCode).toBe(500)
        })

        it('console.errors the error stack', () => {
          expect(console.error).toHaveBeenCalledWith(mockError.stack)
        })

        it('text is the error stack', () => {
          expect(response.text).toBe(mockError.stack)
        })
      })

      describe('if no results are found', () => {
        beforeAll(async () => {
          mockFindResult = noResults
          await makeRequest()
        })
        afterAll(() => {
          mockFindResult = someResults
        })

        it('status is 404', () => {
          expect(response.statusCode).toBe(404)
        })

        it('body is an empty array', () => {
          expect(response.body).toEqual(noResults)
        })
      })
    })

    describe('with a version in the querystring', () => {
      beforeAll(async () => makeRequest(version))

      it('finds all events for the aggregateId', () => {
        expect(mockEvent.find).toHaveBeenCalledWith(
          expect.objectContaining({
            aggregateId,
            version
          })
        )
      })

      it('status is 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('body is the results', () => {
        expect(response.body).toEqual(mockFindResult)
      })

      describe('if there is an error finding events', () => {
        beforeAll(async () => {
          forceFindRejection = true
          await makeRequest(version)
        })
        afterAll(() => {
          forceFindRejection = false
          console.error.mockClear()
        })

        it('status is 500', () => {
          expect(response.statusCode).toBe(500)
        })

        it('console.errors the error stack', () => {
          expect(console.error).toHaveBeenCalledWith(mockError.stack)
        })

        it('text is the error stack', () => {
          expect(response.text).toBe(mockError.stack)
        })
      })

      describe('if no results are found', () => {
        beforeAll(async () => {
          mockFindResult = noResults
          await makeRequest()
        })
        afterAll(() => {
          mockFindResult = someResults
        })

        it('status is 404', () => {
          expect(response.statusCode).toBe(404)
        })

        it('body is an empty array', () => {
          expect(response.body).toEqual(noResults)
        })
      })
    })
  })

  describe('POST', () => {
    const makeRequest = (event, data = {}) => request(app)
      .post(`/${aggregateId}`)
      .send({ event, data })
      .then(res => {
        response = res
        return response
      })

    beforeAll(async () => makeRequest(event, data))

    describe('creates an event', () => {
      it('with the correct aggragate id', () => {
        expect(mockEvent.create).toHaveBeenCalledWith(
          expect.objectContaining({
            aggregateId
          })
        )
      })

      describe('with the correct body', () => {
        it('with the correct event', () => {
          expect(mockEvent.create).toHaveBeenCalledWith(
            expect.objectContaining({
              body: expect.objectContaining({
                event
              })
            })
          )
        })
        it('with the correct data', () => {
          expect(mockEvent.create).toHaveBeenCalledWith(
            expect.objectContaining({
              body: expect.objectContaining({
                data
              })
            })
          )
        })
      })
    })

    it('status is 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('body is the saved event', () => {
      expect(response.body).toEqual(mockSavedEvent)
    })

    describe('if there is an error creating an event', () => {
      beforeAll(async () => {
        forceCreateRejection = true
        await makeRequest(event, data)
      })
      afterAll(() => {
        forceCreateRejection = false
        console.error.mockClear()
      })

      it('status is 500', () => {
        expect(response.statusCode).toBe(500)
      })

      it('console.errors the error stack', () => {
        expect(console.error).toHaveBeenCalledWith(mockError.stack)
      })

      it('text is the error stack', () => {
        expect(response.text).toBe(mockError.stack)
      })
    })
  })
})
