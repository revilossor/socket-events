import io from 'socket.io-client'
import Aggregate from './Aggregate'

class ConnectedAggregate extends Aggregate {
  constructor (url, id) {
    super()
    this.url = url
    this.id = id
    this.socket = io(url)
  }
  // TODO init gets all events over http, opens socket to aggregate stream, supers
  // TODO push sends to socket, supers
  // TODO processes event when received from stream
}

export default ConnectedAggregate
