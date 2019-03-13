import Aggregate from './Aggregate'

class ConnectedAggregate extends Aggregate {
  constructor (socket, url, id) {
    super()
    this.id = id
    this.socket = socket(`${url}/socket`)
  }
  async connect () {
    this.socket.emit('aggregateId', this.id)
    return new Promise(resolve => {
      this.socket.on('init', events => {
        resolve(events.map(event => event.body))
      })
    })
  }
  async init (version) {
    this.events = await this.connect()
    this.socket.on('push', event => {
      this.process(event)
    })
    return super.init(version)
  }
  async push (body) {
    await super.push(body)
    this.socket.emit('push', { aggregateId: this.id, body })
  }
}

export default ConnectedAggregate
