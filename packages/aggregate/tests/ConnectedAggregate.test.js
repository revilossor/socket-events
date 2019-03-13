import Aggregate from '../src/Aggregate'
let ConnectedAggregate

const handlers = {}
const mockSocketInstance = {
  emit: jest.fn(),
  on: jest.fn((key, fn) => {
    handlers[key] = fn
  })
}
const mockSocket = jest.fn(() => mockSocketInstance)

const id = 'mock id'
const url = 'mock url'

let instance

beforeAll(() => {
  ConnectedAggregate = require('../src/ConnectedAggregate').default
})

describe('constructor', () => {
  beforeAll(() => {
    instance = new ConnectedAggregate(mockSocket, url, id)
  })

  it('extends Aggregate', () => {
    expect(ConnectedAggregate.prototype).toBeInstanceOf(Aggregate)
  })

  it('inits the socket with the right url', () => {
    expect(mockSocket).toHaveBeenCalledWith(`${url}/socket`)
  })

  it('stores the socket', () => {
    expect(instance.socket).toBe(mockSocketInstance)
  })

  it('stores the id', () => {
    expect(instance.id).toBe(id)
  })
})

describe('init', () => {
  const version = 999

  let init
  let connect

  const events = [
    { event: 1 },
    { event: 2 },
    { event: 3 }
  ]

  beforeAll(async () => {
    instance = new ConnectedAggregate(mockSocket, url, id)
    init = jest.spyOn(Aggregate.prototype, 'init')
    jest.spyOn(Aggregate.prototype, 'process').mockImplementation(() => {})
    connect = jest.spyOn(instance, 'connect').mockReturnValueOnce(events)
    await instance.init(version)
  })

  afterAll(() => {
    jest.mockRestore(Aggregate.prototype.process)
  })

  it('calls the connect function', () => {
    expect(connect).toHaveBeenCalled()
  })

  it('assigns the data from connect to events array', () => {
    expect(instance.events).toEqual(events)
  })

  it('calls Aggregate init with the item', async () => {
    expect(init).toHaveBeenCalledWith(version)
  })

  it('listents for push events', () => {
    expect(mockSocketInstance.on).toHaveBeenCalledWith('push', expect.any(Function))
  })

  describe('on push event received', () => {
    const item = {
      event: 'event',
      data: 'data'
    }

    let process

    beforeAll(() => {
      process = jest.spyOn(ConnectedAggregate.prototype, 'process').mockReturnValueOnce('')
      handlers['push'](item)
    })

    it('processes the event', () => {
      expect(process).toHaveBeenCalledWith(item)
    })
  })
})

describe('connect', () => {
  const events = [
    { body: { event: 1 } },
    { body: { event: 2 } },
    { body: { event: 3 } }
  ]

  let connectPromise

  beforeAll(async () => {
    instance = new ConnectedAggregate(mockSocket, url, id)
    connectPromise = instance.connect()
  })

  it('emits an aggregateId event', () => {
    expect(mockSocketInstance.emit).toHaveBeenCalledWith('aggregateId', id)
  })

  it('listens for init events', () => {
    expect(mockSocketInstance.on).toHaveBeenCalledWith('init', expect.any(Function))
  })

  describe('init event handler', () => {
    beforeAll(() => {
      handlers['init'](events)
    })

    it('resolves with the body of the events', () => {
      expect(connectPromise).resolves.toEqual(events.map(event => event.body))
    })
  })
})

describe('push', () => {
  let push

  const item = {
    event: 'event',
    data: 'data'
  }

  beforeAll(async () => {
    instance = new ConnectedAggregate(mockSocket, url, id)
    instance.register(item.event, state => state)
    jest.spyOn(instance, 'connect').mockReturnValueOnce([])
    await instance.init()
    push = jest.spyOn(Aggregate.prototype, 'push')
    await instance.push(item)
  })

  it('calls Aggregate push with the item', async () => {
    expect(push).toHaveBeenCalledWith(item)
  })

  it('emits a push event', () => {
    expect(mockSocketInstance.emit).toHaveBeenCalledWith('push', expect.anything())
  })

  it('emitted body is data, aggragateId is id', () => {
    expect(mockSocketInstance.emit).toHaveBeenCalledWith(expect.anything(), {
      aggregateId: id,
      body: item
    })
  })
})
