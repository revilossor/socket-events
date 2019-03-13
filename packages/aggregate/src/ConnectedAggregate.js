import Aggregate from './Aggregate'

class ConnectedAggregate extends Aggregate {
  constructor (socket, url, id) {
    super()
    this.id = id
    this.socket = socket(`${url}/socket`)
  }
  async init (version) {
    this.socket.emit('aggregateId', this.id) // TODO this responds with all events - extract to async...

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
