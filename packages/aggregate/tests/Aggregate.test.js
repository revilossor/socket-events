let Aggregate

const mockSocket = {
  mock: 'socket'
}
const mockIo = jest.fn(() => mockSocket)

const url = 'mock url'
const id = 'mock id'
const event = 'mock event'
const data = 'mock data'

let instance

beforeAll(() => {
  jest.mock('socket.io-client', () => mockIo)
  Aggregate = require('../src/Aggregate').default
})

describe('constructor', () => {
  beforeAll(() => {
    instance = new Aggregate(url, id)
  })

  it('stores the url', () => {
    expect(instance.url).toBe(url)
  })

  it('stores the id', () => {
    expect(instance.id).toBe(id)
  })

  describe('opens a socket', () => {
    it('with the url', () => {
      expect(mockIo).toHaveBeenCalledWith(url)
    })
    it('stores it', () => {
      expect(instance.socket).toBe(mockSocket)
    })
  })

  it('inits state to null', () => {
    expect(instance.state).toBe(null)
  })

  it('inits version to null', () => {
    expect(instance.version).toEqual(0)
  })

  it('inits handlers to an empty object', () => {
    expect(instance.handlers).toEqual({})
  })
})

describe('register', () => {
  beforeAll(() => {
    instance = new Aggregate(url, id)
  })

  it('adds the handler to the instance', () => {
    expect(instance.handlers[event]).not.toBeDefined()
    instance.register(event, () => {})
    expect(instance.handlers[event]).toBeDefined()
  })
})

describe('deregister', () => {
  beforeAll(() => {
    instance = new Aggregate(url, id)
    instance.register(event, () => {})
  })

  it('removed the handler from the instance', () => {
    expect(instance.handlers[event]).toBeDefined()
    instance.deregister(event)
    expect(instance.handlers[event]).not.toBeDefined()
  })
})

describe('push', () => {
  const mockEvent = {
    event,
    data
  }

  describe('if there is a handler for the event', () => {
    const handler = jest.fn((state, data) => `${state} =-> ${data}`)

    let before
    let after

    beforeAll(() => {
      instance = new Aggregate(url, id)
    })

    beforeAll(async () => {
      instance.register(event, handler)
      before = instance.state
      await instance.push(mockEvent)
      after = instance.state
    })

    afterAll(() => {
      instance.derigester(event)
    })

    describe('calls the handler', () => {
      it('with the state', () => {
        expect(handler.mock.calls[0][0]).toEqual(before)
      })
      it('with the event data', () => {
        expect(handler.mock.calls[0][1]).toEqual(data)
      })
    })

    it('updates the state to the return value of the handler', () => {
      expect(after).toEqual(`${before} =-> ${data}`)
    })

    // describe('upodates the event in the store', () => {
    //   it('updates the version to the version of the pushed event', () => {
    //     expect(after).toEqual(`${before} =-> ${data}`)
    //   })
    // })
  })

  describe('if there is no handler for the event', () => {
    beforeAll(() => {
      instance = new Aggregate(url, id)
    })

    it('doesnt change the state', async () => {
      const before = instance.state
      try {
        await instance.push(mockEvent)
      } catch (err) {
        // do nothing
      } finally {
        expect(instance.state).toEqual(before)
      }
    })

    it('rejects with an error', async () => {
      await expect(instance.push(mockEvent)).rejects.toEqual(Error(`cannot handle ${event}`))
    })
  })

  // it('') // TODO calls teh handler, pushes the events
  // TODO if no handler / handler errrors
  // TODO if error pushing
})

// describe('play', () => {
//   // update version to latest and start listening for events
// })
//
// describe('pause', () => {
//   // stop listening for events
// })
//
// describe('pause', () => {
//   // stop listening for events
// })
//
// describe('skip', () => {
//   // inits to a version
// })
//
// describe('forward', () => {
//   // inits to a version + 1
// })
//
// describe('back', () => {
//   // inits to a version - 1
// })
