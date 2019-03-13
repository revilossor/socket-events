import { Component } from 'react'

import SelectRoom from './SelectRoom'
import SelectUser from './SelectUser'
import Messages from './Messages'
import EnterMessage from './EnterMessage'

import EventAggregate from 'revilossor-socket-events-aggregate'

const url = 'http://localhost:8080'

const factory = EventAggregate(url)

class Chat extends Component {
  constructor () {
    super()
    this.state = {
      messages: [],
      room: 'start',
      user: 'new user'
    }
  }

  onMessage = (state, data) => {
    const messages = state || []
    const updated = [ ...messages, data ]
    this.setState({ messages: updated })
    return updated
  }

  async initAggregate (room) {
    this.aggregate = factory(room)
    this.aggregate.state = []

    this.aggregate.register('message', this.onMessage)
    await this.aggregate.init()

    await this.setState({ messages: this.aggregate.state })
  }

  componentDidMount () {
    const { room } = this.state
    this.initAggregate(room)
  }

  changeRoom = (e) => {
    e.preventDefault()
    const room = e.target.elements.room.value
    this.initAggregate(room)
    this.setState({ room })
  }

  changeUser = (e) => {
    e.preventDefault()
    const user = e.target.elements.user.value
    this.setState({ user })
  }

  addMessage = (e) => {
    e.preventDefault()
    const { user } = this.state
    const message = e.target.elements.message.value
    this.aggregate.push({
      event: 'message',
      data: {
        user,
        message
      }
    })
    e.target.reset()
  }

  render () {
    const { messages, room, user } = this.state
    return (
      <div>
        <SelectRoom value={room} onSubmit={this.changeRoom} />
        <SelectUser value={user} onSubmit={this.changeUser} />
        <EnterMessage onSubmit={this.addMessage} />
        <Messages messages={messages} />
      </div>
    )
  }
}

export default Chat
