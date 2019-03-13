const express = require('express')
const app = express()
const sockets = require('./sockets')

const server = require('http').createServer(app)

app.use('/healthcheck', require('./routers/healthcheck'))
app.use('/event', require('./routers/event'))
sockets.use('/socket', server)

module.exports.start = ({ port }) => new Promise((resolve, reject) => {
  server.listen(port, err => {
    err ? reject(err) : resolve()
  })
})
