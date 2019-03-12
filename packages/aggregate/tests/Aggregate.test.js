let Aggregate

const event = 'mock event'
const data = 'mock data'

const mockError = Error('mock error')
const mockEvent = {
  event,
  data
}

let instance

let before
let after

const handler = jest.fn((state, data) => `${state} =-> ${data}`)

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

  it('inits handlers to an empty object', () => {
    expect(instance.handlers).toEqual({})
  })

  it('inits initialized to false', () => {
    expect(instance.initialized).toBe(false)
  })

  it('inits events to an empty array', () => {
    expect(instance.events).toEqual([])
  })
})

describe('version', () => {
  beforeAll(() => {
    instance = new Aggregate()
  })

  it('returns the length of the events array', () => {
    expect(instance.version).toBe(0)
    instance.events = [1, 2, 3]
    expect(instance.version).toBe(3)
  })
})

describe('register', () => {
  beforeAll(() => {
    instance = new Aggregate()
  })

  it('adds the handler for the event', () => {
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

  it('removes the handler', () => {
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

describe('process', () => {
  describe('if the instance has not been initialized', () => {
    beforeAll(() => {
      instance = new Aggregate()
      before = instance.state
    })

    it('rejects with an error', async () => {
      await expect(instance.process(mockEvent)).rejects.toEqual(Error('aggregate not initialized'))
    })

    it('doesnt change the state', async () => {
      try {
        await instance.process(mockEvent)
      } catch (e) {
        expect(instance.state).toEqual(before)
      }
    })
  })

  describe('if there is a handler for the event', () => {
    beforeAll(async () => {
      instance = new Aggregate()
      await instance.init()
    })

    beforeAll(async () => {
      instance.register(event, handler)
      before = instance.state
      await instance.process(mockEvent)
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

    describe('if the handler throws', () => {
      const throwHandler = jest.fn(() => { throw mockError })

      beforeAll(async () => {
        instance = new Aggregate()
        await instance.init()
        instance.register(event, throwHandler)
        before = instance.state
        try {
          await instance.process(mockEvent)
        } catch (err) {
          // do nothing
        }
      })

      it('state remains the same', () => {
        expect(instance.state).toEqual(before)
      })
    })

    describe('if the handler returns a promise', () => {
      const updatedState = 'updated state'

      let forceHandlerRejection = false
      const promiseHandler = jest.fn(() => new Promise((resolve, reject) => {
        forceHandlerRejection
          ? reject(mockError)
          : resolve(updatedState)
      }))

      describe('if it resolves', () => {
        beforeAll(async () => {
          instance = new Aggregate()
          await instance.init()
          instance.register(event, promiseHandler)
          await instance.process(mockEvent)
        })

        it('updates the state to what the handler resolves with', () => {
          expect(instance.state).toEqual(updatedState)
        })
      })
      describe('if it rejects', () => {
        beforeAll(async () => {
          instance = new Aggregate()
          before = instance.state
          await instance.init()
          forceHandlerRejection = true
          instance.register(event, promiseHandler)
          try {
            await instance.process(mockEvent)
          } catch (err) {
            // do nothing
          }
        })

        it('does not update the state', () => {
          expect(instance.state).toEqual(before)
        })
      })
    })
  })

  describe('if there is no handler for the event', () => {
    beforeAll(async () => {
      instance = new Aggregate()
      await instance.init()
    })

    it('doesnt change the state', async () => {
      before = instance.state
      try {
        await instance.process(mockEvent)
      } catch (err) {
        // do nothing
      } finally {
        expect(instance.state).toEqual(before)
      }
    })

    it('rejects with an error', async () => {
      await expect(instance.process(mockEvent)).rejects.toEqual(Error(`cannot handle ${event}`))
    })
  })
})

describe('push', () => {
  let process
  let version

  beforeAll(async () => {
    instance = new Aggregate()
    instance.register(event, handler)
    await instance.init()
    process = jest.spyOn(instance, 'process')
  })

  describe('push one event', () => {
    describe('if the processing rejects', () => {
      beforeAll(async () => {
        before = instance.state
        version = instance.version
        process.mockReturnValueOnce(Promise.reject(mockError))
        try {
          await instance.push(mockEvent)
        } catch (err) {
          // do tnothing
        }
      })

      it('state remains the same', () => {
        expect(instance.state).toEqual(before)
      })

      it('version remains the same', () => {
        expect(instance.version).toEqual(version)
      })
    })

    describe('if the processing resolves', () => {
      beforeAll(async () => {
        version = instance.version
        await instance.push(mockEvent)
      })

      it('state is updated', () => {
        expect(instance.state).toEqual('null =-> mock data')
      })

      it('version is incremented', () => {
        expect(instance.version).toEqual(version + 1)
      })
    })
  })
})
