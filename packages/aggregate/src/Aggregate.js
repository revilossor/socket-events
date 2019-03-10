import io from 'socket.io-client'

class Aggregate {
  constructor (url, id) {
    this.url = url
    this.id = id
    this.socket = io(url)
  }
}

export default Aggregate
