import { Component } from 'react'

class SelectUser extends Component {
  render () {
    const { onSubmit, value } = this.props
    return (
      <form onSubmit={onSubmit}>
        <label>user: </label>
        <input type='text' id='user' name='user' placeholder={value} />
      </form>
    )
  }
}

export default SelectUser
