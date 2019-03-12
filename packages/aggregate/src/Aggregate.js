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
  async init () {
    this.initialized = true
  }
  async process (item) {
    this.initializedCheck()
    if (!this.handlers[item.event]) {
      throw Error(`cannot handle ${item.event}`)
    } else {
      this.state = await this.handlers[item.event].call(this, this.state, item.data)
    }
  }
  async push (item) {
    await this.process(item)
    this.events.push(item)
  }
}

export default Aggregate
