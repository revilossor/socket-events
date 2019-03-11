const server = require('./server')
const store = require('./store')
const announcer = require('./announcer')

const start = async () => {
  await announcer(
    store.connect('mongodb://store:27017/events'),
    'store connected'
  )
  await announcer(
    server.start({ port: 8080 }),
    'server listening'
  )
}

start()
