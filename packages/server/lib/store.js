const mongoose = require('mongoose')

const connectionRetryInterval = 1000

let connectionUri

let timeoutId = 0

mongoose.Promise = global.Promise
const db = mongoose.connection

const connect = () => mongoose.connect(connectionUri, { useNewUrlParser: true })

db.on('error', () => {
  mongoose.disconnect()
})
db.on('disconnected', () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(connect, connectionRetryInterval)
})

module.exports.connect = uri => new Promise((resolve, reject) => {
  connectionUri = uri
  connect()
  db.once('open', () => {
    console.log('connection opened!')
    resolve()
  })
})
