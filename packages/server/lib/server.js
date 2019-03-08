const express = require('express')
const app = express()

app.use('/healthcheck', require('./routers/healthcheck'))

module.exports.start = ({ port }) => {
  app.listen(port)
}
