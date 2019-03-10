const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use('/healthcheck', require('./routers/healthcheck'))
app.use('/event', require('./routers/event'))

io.on('connection', () => {
  console.log('user connected!')
})

module.exports.start = ({ port }) => {
  server.listen(port)
}
