let schema = {}
function MockSchema (object) {
  schema = object
}
MockSchema.Types = {
  String: 'string',
  Mixed: 'mixed',
  Number: 'number'
}

const error = Error('mock error')

const savedEvent = { saved: 'event' }
const foundEvents = [ { ...savedEvent }, { ...savedEvent }, { ...savedEvent } ]
const countEventsTotal = 42

let doc

let forceSaveRejection = false
let forceFindRejection = false
let forceCountRejection = false

function MockModel (object) {
  doc = object
}
MockModel.prototype.save = jest.fn(cb => {
  forceSaveRejection
    ? cb(error)
    : cb(undefined, savedEvent)
})
MockModel.find = jest.fn((comparator, cb) => {
  forceFindRejection
    ? cb(error)
    : cb(undefined, foundEvents)
})
MockModel.count = jest.fn((aggregateId, cb) => {
  forceCountRejection
    ? cb(error)
    : cb(undefined, countEventsTotal)
})

const mockMongoose = {
  model: jest.fn(() => MockModel),
  Schema: MockSchema
}

jest.mock('mongoose', () => mockMongoose)

let Event

beforeAll(() => {
  Event = require('../../lib/models/event')
})

describe('creates a mongoose schema', () => {
  it('with an aggregateId that should be a string type', () => {
    expect(schema.aggregateId).toBe(MockSchema.Types.String)
  })
  it('with a version that should be a number type', () => {
    expect(schema.version).toBe(MockSchema.Types.Number)
  })
  describe('with a body', () => {
    it('with a type that should be a string type', () => {
      expect(schema.body.type).toBe(MockSchema.Types.String)
    })
    it('with a data that should be a mixed type', () => {
      expect(schema.body.data).toBe(MockSchema.Types.Mixed)
    })
  })
})

describe('creates a mongoose model', () => {
  it('called "Event"', () => {
    expect(mockMongoose.model).toHaveBeenCalledWith('Event', expect.anything())
  })
  it('with the schema', () => {
    expect(mockMongoose.model).toHaveBeenCalledWith(expect.anything(), expect.any(MockSchema))
  })
})

describe('create', () => {
  const argument = {
    aggregateId: `aggregate-${Date.now()}`,
    body: {
      type: 'some aggregate event type',
      data: {
        numberOfKittens: 'over nine thousand'
      }
    }
  }

  beforeAll(() => Event.create(argument))

  it('gets the count for the arguments aggregateId', () => {
    expect(MockModel.count).toHaveBeenCalledWith({ aggregateId: argument.aggregateId }, expect.anything())
  })

  describe('constructs an Event', () => {
    it('with the argument', () => {
      expect(doc).toEqual(expect.objectContaining(argument))
    })

    it('with the version property set to the count result', () => {
      expect(doc).toEqual(
        expect.objectContaining({
          version: countEventsTotal
        })
      )
    })
  })

  it('calls the Event instances save function', () => {
    expect(MockModel.prototype.save).toHaveBeenCalled()
  })

  describe('returns a promise', () => {
    it('resolves with the saved event if the save is a success', async () => {
      forceSaveRejection = false
      await expect(Event.create(argument)).resolves.toEqual(savedEvent)
    })

    it('rejects with the error if the save fails', async () => {
      forceSaveRejection = true
      await expect(Event.create(argument)).rejects.toEqual(error)
    })
  })
})

describe('read', () => {
  const argument = {
    some: 'comparator'
  }

  beforeAll(() => Event.find(argument))

  it('finds all events with the comparator argument', () => {
    expect(MockModel.find).toHaveBeenCalledWith(argument, expect.anything())
  })

  describe('returns a promise', () => {
    it('resolves with the found events if the find is a success', async () => {
      forceFindRejection = false
      await expect(Event.find(argument)).resolves.toEqual(foundEvents)
    })

    it('rejects with the error if the find fails', async () => {
      forceFindRejection = true
      await expect(Event.find(argument)).rejects.toEqual(error)
    })
  })
})

describe('count', () => {
  const aggregateId = `aggregate-${Date.now()}`

  beforeAll(() => Event.count(aggregateId))

  it('counts all events with the aggregateId argument', () => {
    expect(MockModel.count).toHaveBeenCalledWith({ aggregateId }, expect.anything())
  })

  describe('returns a promise', () => {
    it('resolves with the result if the count is a success', async () => {
      forceCountRejection = false
      await expect(Event.count(aggregateId)).resolves.toEqual(countEventsTotal)
    })

    it('rejects with the error if the count fails', async () => {
      forceCountRejection = true
      await expect(Event.count(aggregateId)).rejects.toEqual(error)
    })
  })
})
