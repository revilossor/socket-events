const express = require('express')
const app = express()

app.use('/healthcheck', require('./routers/healthcheck'))
app.use('/event', require('./routers/event'))

module.exports.start = ({ port }) => {
  app.listen(port)
}
