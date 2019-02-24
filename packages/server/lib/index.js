const server = require('./server')
const store = require('./store')

const start = async () => {
  await store.connect('mongodb://store:27017/events')
  server.start({
    port: 8080
  })
}

start()
