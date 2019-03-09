const mongoose = require('mongoose')

module.exports = mongoose.model('Event', new mongoose.Schema({
  aggregateId: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  body: {
    event: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  version: {
    type: mongoose.Schema.Types.Number,
    required: true,
    min: 0
  }
}))
