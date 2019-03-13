import { Component } from 'react'

import SelectRoom from '../components/SelectRoom'
import Messages from '../components/Messages'
import EnterMessage from '../components/EnterMessage'

class Index extends Component {
  render () {
    return (
      <div>
        <SelectRoom />
        <Messages />
        <EnterMessage />
      </div>
    )
  }

  static geiInitialProps = async () => {
    console.log('get initial props!')
    return {}
  }
}

export default Index
