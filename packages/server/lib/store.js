const mongoose = require('mongoose')

const uri = 'mongodb://store:27017/server'

mongoose.Promise = global.Promise
const db = mongoose.connection

db.on('connecting', () => {
  console.log(`connecting to ${uri}`)
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
  mongoose.connect(uri, { server: { auto_reconnect: true } })
})

mongoose.connect(uri, { server: { auto_reconnect: true } })

module.exports = new Promise((resolve, reject) => {
  db.once('open', () => {
    console.log('connection opened!')
    resolve()
  })
})
