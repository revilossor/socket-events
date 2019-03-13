const socketio = require('socket.io')
const Event = require('./event')

module.exports.use = (route, server) => {
  const io = socketio(server)
  const ws = io.of(route)

  ws.on('connection', socket => {
    console.log('connection')
    socket.on('aggregateId', aggregateId => { // TODO this responds with all events
      socket.join(aggregateId)
    })

    socket.on('push', event => {
      Event.create(event).then(() => {
        socket.in(event.aggregateId).emit('push', event.body)
      })
    })
  })
}
