import Aggregate from '../src/Aggregate.js'

describe('constructor', () => {
  const url = 'mock url'
  const id = 'mock id'

  let instance

  beforeAll(() => {
    instance = new Aggregate(url, id)
  })

  it('stores the url', () => {
    expect(instance.url).toBe(url)
  })

  it('stores the id', () => {
    expect(instance.id).toBe(id)
  })
})
