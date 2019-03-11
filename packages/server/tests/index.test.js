const mockServer = {
  start: jest.fn(() => Promise.resolve())
}
jest.mock('../lib/server', () => mockServer)

const uri = 'mongodb://store:27017/events' // TODO envs for config?

const mockStore = {
  connect: jest.fn(() => Promise.resolve())
}
jest.mock('../lib/store', () => mockStore)

beforeAll(() => {
  console.log = jest.fn()
  require('../lib/index')
})

describe('connects to the store', () => {
  it(`uri is "${uri}"`, () => {
    expect(mockStore.connect).toHaveBeenCalledWith(uri)
  })
})

describe('logs', () => {
  it('when the store is connected', () => {
    expect(console.log).toHaveBeenCalledWith('store connected')
  })
  it('when the server is listening', () => {
    expect(console.log).toHaveBeenCalledWith('server listening')
  })
})

describe('starts the server', () => {
  it(`"port" is "8080"`, () => {
    expect(mockServer.start).toHaveBeenCalledWith(
      expect.objectContaining({ port: 8080 })
    )
  })
})
