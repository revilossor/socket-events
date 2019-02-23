const express = require('express')
const app = express()

module.exports.start = ({ port }) => {
  app.listen(port)
}
