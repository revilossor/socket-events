import { Component } from 'react'

class EnterMessage extends Component {
  render () {
    const { onSubmit } = this.props
    return (
      <form onSubmit={onSubmit}>
        <input type='textarea' id='message' name='message' />
      </form>
    )
  }
}

export default EnterMessage
