const request = require('supertest')
const express = require('express')

let app
let response

const error = new Error('mock error')
const errorString = `${error}`

const decompressedJson = { decompressed: 'json' }

let forceDecompressionRejection = false

const mockCodec = {
  decompress: jest.fn(() => new Promise((resolve, reject) => {
    forceDecompressionRejection
      ? reject(error)
      : resolve(decompressedJson)
  }))
}

const mockJsonUrl = jest.fn(() => mockCodec)

jest.mock('json-url', () => mockJsonUrl)

const createdEvent = { created: 'event' }
let foundEvents = [ { ...createdEvent }, { ...createdEvent }, { ...createdEvent } ]
const countEventsTotal = 42

let forceCreateRejection = false
let forceFindRejection = false
let forceCountRejection = false

const mockModel = {
  create: jest.fn(() => new Promise((resolve, reject) => {
    forceCreateRejection
      ? reject(error)
      : resolve(createdEvent)
  })),
  find: jest.fn(() => new Promise((resolve, reject) => {
    forceFindRejection
      ? reject(error)
      : resolve(foundEvents)
  })),
  count: jest.fn(() => new Promise((resolve, reject) => {
    forceCountRejection
      ? reject(error)
      : resolve(countEventsTotal)
  }))
}

jest.mock('../../lib/models/event', () => mockModel)

beforeAll(() => {
  console.error = jest.fn()
  jest.spyOn(express.Router, 'route')
  app = express()
  app.use('/', require('../../lib/routers/event'))
})

it('inits json-url with lzw codec', () => {
  expect(mockJsonUrl).toHaveBeenCalledWith('lzw')
})

it('sets a route for /', () => {
  expect(express.Router.route).toHaveBeenCalledWith('/')
})

it('sets a route for /:aggregateId', () => {
  expect(express.Router.route).toHaveBeenCalledWith('/:aggregateId')
})
//
// it('sets a route for /:aggregateId/count', () => {
//   expect(express.Router.route).toHaveBeenCalledWith('/:aggregateId/count')
// })

describe('"GET /" for querying events', () => {
  describe('with a "query" querystring parameter', () => {
    const query = 'some compressed query'

    const requestQuery = query => request(app)
      .get(`/?query=${query}`)
      .then(res => {
        response = res
        return response
      })

    beforeAll(() => {
      jest.clearAllMocks()
      forceDecompressionRejection = false
      return requestQuery(query)
    })

    it('decompresses the query', () => {
      expect(mockCodec.decompress).toHaveBeenCalledWith(query)
    })

    it('finds events using the decompressed comparator', () => {
      expect(mockModel.find).toHaveBeenCalledWith(decompressedJson)
    })

    describe('that unpacks to a valid comparator', () => { // TODO schema validation module...?
      describe('that finds some results', () => {
        beforeAll(() => {
          jest.clearAllMocks()
          forceDecompressionRejection = false
          foundEvents = [{ ...createdEvent }, { ...createdEvent }]
          return requestQuery(query)
        })

        it('status is 200', () => {
          expect(response.statusCode).toBe(200)
        })

        it('body is array of found events', () => {
          expect(response.body).toEqual(foundEvents)
        })
      })

      describe('that doesnt find any results', () => {
        beforeAll(() => {
          jest.clearAllMocks()
          forceDecompressionRejection = false
          foundEvents = []
          return requestQuery(query)
        })

        it('status is 404', () => {
          expect(response.statusCode).toBe(404)
        })

        it('body is an empty array', () => {
          expect(response.body).toEqual([])
        })
      })

      describe('that errors finding results', () => {
        beforeAll(() => {
          jest.clearAllMocks()
          forceDecompressionRejection = false
          forceFindRejection = true
          return requestQuery(query)
        })

        it('status is 500', () => {
          expect(response.statusCode).toBe(500)
        })

        it('console.errors', () => {
          expect(console.error).toHaveBeenCalledWith(errorString)
        })

        it('text is the stringified error', () => {
          expect(response.text).toBe(errorString)
        })
      })
    })

    describe('that errors unpacking', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        forceDecompressionRejection = true
        forceFindRejection = false
        return requestQuery(query)
      })

      it('status is 500', () => {
        expect(response.statusCode).toBe(500)
      })

      it('console.errors', () => {
        expect(console.error).toHaveBeenCalledWith(errorString)
      })

      it('text is the stringified error', () => {
        expect(response.text).toBe(errorString)
      })
    })
  })

  describe('with no querystring', () => {
    beforeAll(() => {
      jest.clearAllMocks()
      forceDecompressionRejection = false
      forceFindRejection = false
      return request(app)
        .get(`/`)
        .then(res => {
          response = res
          return response
        })
    })

    it('status is 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('text is "no query parameter found"', () => {
      expect(response.text).toBe('no query parameter found')
    })
  })
})

describe('"GET /:aggregateId" for getting events for an aggregate', () => {
  const aggregateId = `aggregate-${Date.now()}`

  const requestAggregateVersion = (id, version) => request(app)
    .get(`/${id}${typeof (version) === 'undefined' ? '' : `?version=${version}`}`)
    .then(res => {
      response = res
      return response
    })

  beforeAll(() => {
    forceFindRejection = false
    foundEvents = [
      { ...createdEvent, version: 0 },
      { ...createdEvent, version: 1 },
      { ...createdEvent, version: 2 }
    ]
    return requestAggregateVersion(aggregateId)
  })

  it('finds all events for the aggregateId', () => {
    expect(mockModel.find).toHaveBeenCalledWith(
      expect.objectContaining({ aggregateId })
    )
  })

  describe('with no version parameter', () => {
    describe('if some events are found', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        return requestAggregateVersion(aggregateId)
      })

      it('status is 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('body is array of all found events', () => {
        expect(response.body).toEqual(foundEvents)
      })
    })
    describe('if no events are found', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        foundEvents = []
        return requestAggregateVersion(aggregateId)
      })

      it('status is 404', () => {
        expect(response.statusCode).toBe(404)
      })

      it('body is an empty array', () => {
        expect(response.body).toEqual([])
      })
    })
    describe('if there is an error finding events', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        forceFindRejection = true
        return requestAggregateVersion(aggregateId)
      })

      it('status is 500', () => {
        expect(response.statusCode).toBe(500)
      })

      it('console.errors', () => {
        expect(console.error).toHaveBeenCalledWith(errorString)
      })

      it('text is the stringified error', () => {
        expect(response.text).toBe(errorString)
      })
    })
  })
  describe('with a version parameter', () => {
    let version = 2

    beforeAll(() => {
      forceFindRejection = false
      foundEvents = [
        { ...createdEvent, version: 0 },
        { ...createdEvent, version: 1 },
        { ...createdEvent, version: 2 }
      ]
      return requestAggregateVersion(aggregateId, version)
    })

    it('finds all events with a version less than the version parameter', () => {
      expect(mockModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          version: { $lte: version }
        })
      )
    })

    describe('if the version isnt an integer', () => {
      const parseErrorMessage = 'Error: version is not an integer'

      beforeAll(() => {
        jest.clearAllMocks()
        return requestAggregateVersion(aggregateId, 'the moon')
      })

      it('status is 500', () => {
        expect(response.statusCode).toBe(500)
      })

      it('console.errors', () => {
        expect(console.error).toHaveBeenCalledWith(parseErrorMessage)
      })

      it(`text is "${parseErrorMessage}"`, () => {
        expect(response.text).toBe(parseErrorMessage)
      })
    })

    describe('if some events are found', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        return requestAggregateVersion(aggregateId, version)
      })

      it('status is 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('body is array of all found events', () => {
        expect(response.body).toEqual(foundEvents)
      })
    })
    describe('if no events are found', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        foundEvents = []
        return requestAggregateVersion(aggregateId, version)
      })

      it('status is 404', () => {
        expect(response.statusCode).toBe(404)
      })

      it('body is an empty array', () => {
        expect(response.body).toEqual([])
      })
    })
    describe('if there is an error finding events', () => {
      beforeAll(() => {
        jest.clearAllMocks()
        forceFindRejection = true
        return requestAggregateVersion(aggregateId, version)
      })

      it('status is 500', () => {
        expect(response.statusCode).toBe(500)
      })

      it('console.errors', () => {
        expect(console.error).toHaveBeenCalledWith(errorString)
      })

      it('text is the stringified error', () => {
        expect(response.text).toBe(errorString)
      })
    })
  })
})
