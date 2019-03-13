import { Component } from 'react'

import dynamic from 'next/dynamic'

const Chat = dynamic(() => import('../components/Chat'), {
  ssr: false
})

class Index extends Component {
  render () {
    return (
      <Chat />
    )
  }
}

export default Index
