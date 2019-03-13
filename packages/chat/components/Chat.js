import { Component } from 'react'

import SelectRoom from './SelectRoom'
import Messages from './Messages'
import EnterMessage from './EnterMessage'

// import EventAggregate from 'revilossor-socket-events-aggregate'
// import socket from 'socket.io-client'
//
// const url = 'http://server:8080'
//
// const factory = EventAggregate(socket, url)

class Chat extends Component {
  constructor () {
    console.log('constructor')
    super()
    // const aggregate = factory('chat')
    // aggregate.register('message', (state, data) => {
    //   console.dir({ state, data })
    //   return []
    // })
    // this.aggregate = aggregate
    // console.log('agg: ' + this.aggregate)
  }

  componentDidMount () {
    console.log('mount ')
  }

  render () {
    console.log('render')
    return (
      <div>
        <SelectRoom />
        <Messages messages={['init', 'something']} />
        <EnterMessage />
      </div>
    )
  }
}

export default Chat
