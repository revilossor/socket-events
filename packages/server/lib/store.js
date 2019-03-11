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

module.exports.connect = async uri => {
  connectionUri = uri
  return connect()
}
