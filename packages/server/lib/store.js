const mongoose = require('mongoose')

let connectionUri

mongoose.Promise = global.Promise
const db = mongoose.connection

db.on('error', () => {
  mongoose.disconnect()
})
db.on('disconnected', () => {
  setTimeout(() => {
    mongoose.connect(connectionUri, { useNewUrlParser: true })
  }, 1000)
})

module.exports.connect = uri => new Promise((resolve, reject) => {
  connectionUri = uri
  mongoose.connect(connectionUri, { useNewUrlParser: true })
  db.once('open', () => {
    console.log('connection opened!')
    resolve()
  })
})
