import { Component } from 'react'

class Messages extends Component {
  render () {
    const { messages } = this.props
    return (
      <div>
        {messages.map(
          ({ user, message }, i) => <p key={'key-' + i}>{user}::{message}</p>
        )}
      </div>
    )
  }
}

export default Messages
