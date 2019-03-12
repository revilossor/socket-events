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

  beforeAll(async () => {
    instance = new ConnectedAggregate(mockSocket, url, id)
    init = jest.spyOn(Aggregate.prototype, 'init')
    await instance.init(version)
  })

  it('calls Aggregate init with the item', async () => {
    expect(init).toHaveBeenCalledWith(version)
  })

  it('emits an aggregateId event with the id', () => {
    expect(mockSocketInstance.emit).toHaveBeenCalledWith('aggregateId', id)
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

describe('push', () => {
  let push

  const item = {
    event: 'event',
    data: 'data'
  }

  beforeAll(async () => {
    instance = new ConnectedAggregate(mockSocket, url, id)
    instance.register(item.event, state => state)
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
