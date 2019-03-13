import { Component } from 'react'

class SelectRoom extends Component {
  render () {
    const { onSubmit, value } = this.props
    return (
      <form onSubmit={onSubmit}>
        <label>room: </label>
        <input type='text' id='room' name='room' placeholder={value} />
      </form>
    )
  }
}

export default SelectRoom
