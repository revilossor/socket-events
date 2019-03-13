const socketio = require('socket.io')
const Event = require('./event')

module.exports.use = (route, server) => {
  const io = socketio(server)
  const ws = io.of(route)

  ws.on('connection', socket => {
    socket.on('aggregateId', aggregateId => {
      socket.join(aggregateId)
      Event.find({ aggregateId }).then(events => {
        socket.emit('init', events)
      })
    })

    socket.on('push', event => {
      Event.create(event).then(() => {
        socket.in(event.aggregateId).emit('push', event.body)
      })
    })
  })
}
