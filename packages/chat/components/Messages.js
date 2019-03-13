import { Component } from 'react'

class Messages extends Component {
  render () {
    const { messages } = this.props
    return (
      <div>
        {messages.map(
          (message, i) => <p key={'key-' + i}>{message}</p>
        )}
      </div>
    )
  }
}

export default Messages
