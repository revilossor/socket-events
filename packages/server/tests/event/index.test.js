const error = Error('mock error')

const savedEvent = {
  body: { saved: 'event' },
  _id: 0,
  __v: 0
}
const foundEvents = [ { ...savedEvent }, { ...savedEvent }, { ...savedEvent } ]
const countEventsTotal = 42

let doc

let forceSaveRejection = false
let forceFindRejection = false
let forceCountRejection = false

function MockModel (object) {
  doc = object
}
MockModel.prototype.save = jest.fn(cb => forceSaveRejection
  ? Promise.reject(error)
  : Promise.resolve(savedEvent)
)
MockModel.find = jest.fn(comparator => forceFindRejection
  ? Promise.reject(error)
  : Promise.resolve(foundEvents)
)
MockModel.countDocuments = jest.fn(aggregateId => forceCountRejection
  ? Promise.reject(error)
  : Promise.resolve(countEventsTotal)
)

jest.mock('../../lib/event/model', () => MockModel)

let Event

beforeAll(() => {
  Event = require('../../lib/event')
})

describe('create', () => {
  const argument = {
    aggregateId: `aggregate-${Date.now()}`,
    body: {
      event: 'some aggregate event type',
      data: {
        numberOfKittens: 'over nine thousand'
      }
    }
  }

  beforeAll(() => Event.create(argument))

  it('gets the count for the arguments aggregateId', () => {
    expect(MockModel.countDocuments).toHaveBeenCalledWith({ aggregateId: argument.aggregateId })
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
    describe('resolves with the saved event if the save is a success', async () => {
      let result

      beforeAll(async () => {
        forceSaveRejection = false
        result = await Event.create(argument)
      })

      it('the body is the event', () => {
        expect(result).toEqual(expect.objectContaining({ body: savedEvent.body }))
      })

      it('the version is the result of the count', () => {
        expect(result).toEqual(expect.objectContaining({
          version: countEventsTotal
        }))
      })

      it('there are no other properties in the response', () => {
        expect(Object.keys(result)).toEqual([
          'body', 'version'
        ])
      })
    })

    it('rejects with the error if the save fails', async () => {
      forceSaveRejection = true
      await expect(Event.create(argument)).rejects.toEqual(error)
    })
  })
})

describe('find', () => {
  const argument = {
    some: 'comparator'
  }

  beforeAll(() => Event.find(argument))

  it('finds all events with the comparator argument', () => {
    expect(MockModel.find).toHaveBeenCalledWith(argument, expect.anything())
  })

  describe('excludes fields from the response', () => {
    it('mongo id', () => {
      expect(MockModel.find).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        _id: 0
      }))
    })
    it('mongo version', () => {
      expect(MockModel.find).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        __v: 0
      }))
    })
    it('aggregate id', () => {
      expect(MockModel.find).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        aggregateId: 0
      }))
    })
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
    expect(MockModel.countDocuments).toHaveBeenCalledWith({ aggregateId })
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
