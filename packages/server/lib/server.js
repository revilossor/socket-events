const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const ws = io.of('/socket')

app.use('/healthcheck', require('./routers/healthcheck'))
app.use('/event', require('./routers/event'))

ws.on('connection', socket => {
  console.log('user connected!')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('aggregateId', aggregateId => {
    console.log('join room ' + aggregateId)
    socket.join(aggregateId)
  })

  socket.on('push', event => {
    console.log('push event ' + JSON.stringify(event))
    socket.in(event.aggregateId).emit('push', event.body)
  })
})

module.exports.start = ({ port }) => new Promise((resolve, reject) => {
  server.listen(port, err => {
    err ? reject(err) : resolve()
  })
})
