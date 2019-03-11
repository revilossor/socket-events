import io from 'socket.io-client'

class Aggregate {
  constructor (url, id) {
    this.url = url
    this.id = id
    this.socket = io(url)
    this.state = null
    this.handlers = {}
    this.version = 0
    this.initialized = false
    this.initializedCheck = () => {
      if (!this.initialized) {
        throw Error('aggregate not initialized')
      }
    }
  }
  register (event, handler) {
    this.handlers[event] = handler
  }
  deregister (event) {
    delete this.handlers[event]
  }
  init () {
    this.initialized = true
  }
  async push (item) {
    this.initializedCheck()
    if (!this.handlers[item.event]) {
      throw Error(`cannot handle ${item.event}`)
    } else {
      this.state = this.handlers[item.event].call(this, this.state, item.data)
    }
  }
}

export default Aggregate
