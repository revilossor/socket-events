const server = require('../lib/server')

jest.mock('../lib/server')

beforeAll(() => {
  require('../lib/index')
})

describe('starts the server', () => {
  const calledWithProp = prop => {
    const key = Object.keys(prop)[0]
    it(`"${key}" is "${prop[key]}"`, () => {
      expect(server.start).toHaveBeenCalledWith(expect.objectContaining(prop))
    })
  }

  calledWithProp({ port: 8080 })
})
