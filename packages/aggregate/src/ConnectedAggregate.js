import io from 'socket.io-client'
import Aggregate from './Aggregate'

class ConnectedAggregate extends Aggregate {
  constructor (url, id) {
    super()
    this.url = url
    this.id = id
    this.socket = io(url)
  }
}

export default ConnectedAggregate
