const server = require('../lib/server')

jest.mock('../lib/server')

beforeAll(() => {
  require('../lib/index')
})

describe('starts the server', () => {
  it(`"port" is "8080"`, () => {
    expect(server.start).toHaveBeenCalledWith(
      expect.objectContaining({ port: 8080 })
    )
  })
})
