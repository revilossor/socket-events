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

let mockFindResult = someResults

const mockEvent = {
  create: jest.fn(() => new Promise((resolve, reject) => {
    forceCreateRejection
      ? reject(mockError)
      : resolve()
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

jest.mock('../../lib/event', () => mockEvent)

const aggregateId = 'aggregateId'
const version = '42'

let app

beforeAll(() => {
  jest.spyOn(express.Router, 'route')
  console.error = jest.fn()
  app = express()
  app.use('/', require('../../lib/routers/event'))
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
})
