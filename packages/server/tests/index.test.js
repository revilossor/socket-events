const server = require('../lib/server')

jest.mock('../lib/server')

const uri = 'mongodb://store:27017/events' // TODO envs for config?

const mockStore = {
  connect: jest.fn(() => Promise.resolve())
}

jest.mock('../lib/store', () => mockStore)

beforeAll(() => {
  require('../lib/index')
})

describe('connects to the store', () => {
  it(`uri is "${uri}"`, () => {
    expect(mockStore.connect).toHaveBeenCalledWith(uri)
  })
})

describe('starts the server', () => {
  it(`"port" is "8080"`, () => {
    expect(server.start).toHaveBeenCalledWith(
      expect.objectContaining({ port: 8080 })
    )
  })
})
