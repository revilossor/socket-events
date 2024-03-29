const mockServer = {}

const mockOnHandlers = {}
const mockInRoom = {
  emit: jest.fn()
}
const mockNamespace = {
  on: jest.fn((key, func) => { mockOnHandlers[key] = func }),
  join: jest.fn(),
  emit: jest.fn(),
  in: jest.fn(() => mockInRoom)
}
const mockIo = {
  of: jest.fn(() => mockNamespace)
}
const mockSocketIo = jest.fn(() => mockIo)

const mockEvents = [
  { event: 1 },
  { event: 2 },
  { event: 3 }
]

const mockEventModel = {
  create: jest.fn(() => Promise.resolve()),
  find: jest.fn(() => Promise.resolve(mockEvents))
}

let sockets

beforeAll(() => {
  jest.mock('socket.io', () => mockSocketIo)
  jest.mock('../lib/event', () => mockEventModel)
  sockets = require('../lib/sockets')
})

describe('use', () => {
  const route = '/route'
  const aggregateId = 'aggregateId'

  beforeAll(() => {
    sockets.use(route, mockServer)
  })

  it('creates an io instance', () => {
    expect(mockSocketIo).toHaveBeenCalledWith(mockServer)
  })
  it('creates a namespace for the route', () => {
    expect(mockIo.of).toHaveBeenCalledWith(route)
  })
  it('listens for connections in namespace', () => {
    expect(mockNamespace.on).toHaveBeenCalledWith('connection', expect.any(Function))
  })
  describe('on client connection', () => {
    beforeAll(() => {
      console.log = jest.fn()
      mockOnHandlers.connection(mockNamespace)
    })
    it('listens for aggregateId events', () => {
      expect(mockOnHandlers.aggregateId).toBeDefined()
    })
    describe('on aggregateId', () => {
      beforeAll(() => {
        mockOnHandlers.aggregateId(aggregateId)
      })
      it('gets all events for the aggregateId from the store', () => {
        expect(mockEventModel.find).toHaveBeenCalledWith({ aggregateId })
      })
      it('joins the room', () => {
        expect(mockNamespace.join).toHaveBeenCalledWith(aggregateId)
      })
      it('emits an init event to the sender with found events', () => {
        expect(mockNamespace.emit).toHaveBeenCalledWith('init', mockEvents)
      })
    })

    it('listens for push events', () => {
      expect(mockOnHandlers.push).toBeDefined()
    })
    describe('on push', () => {
      const mockEvent = {
        aggregateId,
        body: {
          event: 'mock event',
          data: 'mock data'
        }
      }

      beforeAll(() => {
        mockOnHandlers.push(mockEvent)
      })

      it('creates a new event in the store', () => {
        expect(mockEventModel.create).toHaveBeenCalledWith(mockEvent)
      })

      it('emits the event to all in room', () => {
        expect(mockNamespace.in).toHaveBeenCalledWith(aggregateId)
        expect(mockInRoom.emit).toHaveBeenCalledWith('push', mockEvent.body)
      })
    })
  })
})
