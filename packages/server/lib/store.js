const mongoose = require('mongoose')

let connectionUri

mongoose.Promise = global.Promise
const db = mongoose.connection

db.on('connecting', () => {
  console.log(`connecting to ${connectionUri}`)
})
db.on('error', err => {
  console.error(`error connecting: ${err}`)
  mongoose.disconnect()
})
db.on('connected', () => {
  console.log('connected!')
})
db.on('reconnected', () => {
  console.log('reconnected!')
})
db.on('disconnected', () => {
  console.log('disconnected!')
  mongoose.connect(connectionUri, { server: { auto_reconnect: true } })
})

module.exports.connect = uri => new Promise((resolve, reject) => {
  connectionUri = uri
  mongoose.connect(connectionUri, { server: { auto_reconnect: true } })
  db.once('open', () => {
    console.log('connection opened!')
    resolve()
  })
})
