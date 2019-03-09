let schema = {}
function MockSchema (object) {
  schema = object
}
MockSchema.Types = {
  String: 'string',
  Mixed: 'mixed',
  Number: 'number'
}

function MockModel (object) {}
const mockMongoose = {
  model: jest.fn(() => MockModel),
  Schema: MockSchema
}

jest.mock('mongoose', () => mockMongoose)

let Event

beforeAll(() => {
  Event = require('../../lib/event/model')
})

describe('creates a mongoose schema', () => {
  describe('with an aggregateId', () => {
    it('that should be a string', () => {
      expect(schema.aggregateId.type).toBe(MockSchema.Types.String)
    })
    it('that is required', () => {
      expect(schema.aggregateId.required).toBe(true)
    })
  })
  describe('with a version', () => {
    it('that should be a number', () => {
      expect(schema.version.type).toBe(MockSchema.Types.Number)
    })
    it('that is required', () => {
      expect(schema.version.required).toBe(true)
    })
    it('that should be 0 or greater', () => {
      expect(schema.version.min).toEqual(0)
    })
  })
  describe('with a body', () => {
    describe('with an event', () => {
      it('that should be a string', () => {
        expect(schema.body.event.type).toBe(MockSchema.Types.String)
      })
      it('that is required', () => {
        expect(schema.body.event.required).toBe(true)
      })
    })
    it('with data that should be a mixed type', () => {
      expect(schema.body.data.type).toBe(MockSchema.Types.Mixed)
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

it('module returns the model', () => {
  expect(Event).toEqual(MockModel)
})
