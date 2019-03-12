let Aggregate

const event = 'mock event'
const data = 'mock data'

let instance

beforeAll(() => {
  Aggregate = require('../src/Aggregate').default
})

describe('constructor', () => {
  beforeAll(() => {
    instance = new Aggregate()
  })

  it('inits state to null', () => {
    expect(instance.state).toBe(null)
  })

  it('inits version to null', () => {
    expect(instance.version).toBe(0)
  })

  it('inits handlers to an empty object', () => {
    expect(instance.handlers).toEqual({})
  })

  it('inits initialized to false', () => {
    expect(instance.initialized).toBe(false)
  })
})

describe('register', () => {
  beforeAll(() => {
    instance = new Aggregate()
  })

  it('adds the handler to the instance', () => {
    expect(instance.handlers[event]).not.toBeDefined()
    instance.register(event, () => {})
    expect(instance.handlers[event]).toBeDefined()
  })
})

describe('deregister', () => {
  beforeAll(() => {
    instance = new Aggregate()
    instance.register(event, () => {})
  })

  it('removed the handler from the instance', () => {
    expect(instance.handlers[event]).toBeDefined()
    instance.deregister(event)
    expect(instance.handlers[event]).not.toBeDefined()
  })
})

describe('init', () => {
  describe('with no version argument', () => {
    beforeAll(async () => {
      instance = new Aggregate()
      await instance.init()
    })

    it('sets instance initialized to true', () => {
      expect(instance.initialized).toBe(true)
    })
  })
})

describe('push', () => {
  const mockEvent = {
    event,
    data
  }

  describe('if the instance has not been initialized', () => {
    beforeAll(() => {
      instance = new Aggregate()
    })

    it('rejects with an error', async () => {
      await expect(instance.push(mockEvent)).rejects.toEqual(Error('aggregate not initialized'))
    })
  })

  describe('if there is a handler for the event', () => {
    const handler = jest.fn((state, data) => `${state} =-> ${data}`)

    let before
    let after

    beforeAll(async () => {
      instance = new Aggregate()
      await instance.init()
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
    beforeAll(async () => {
      instance = new Aggregate()
      await instance.init()
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
