class Aggregate {
  constructor () {
    this.state = null
    this.handlers = {}
    this.initialized = false
    this.events = []
  }
  get version () {
    return this.events.length
  }
  initializedCheck () {
    if (!this.initialized) {
      throw Error('aggregate not initialized')
    }
  }
  register (event, handler) {
    this.handlers[event] = handler
  }
  deregister (event) {
    delete this.handlers[event]
  }
  async process (item) {
    this.initializedCheck()
    if (!this.handlers[item.event]) {
      throw Error(`cannot handle ${item.event}`)
    } else {
      this.state = await this.handlers[item.event].call(this, this.state, item.data)
    }
  }
  async init (version) {
    this.initialized = true
    const trimmed = this.events.slice(0, version + 1 || this.events.length)
    for (const event of trimmed) {
      await this.process(event)
    }
    this.events = trimmed
  }
  async push (item) {
    await this.process(item)
    this.events.push(item)
  }
}

export default Aggregate
