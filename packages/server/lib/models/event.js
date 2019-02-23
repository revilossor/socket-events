const mongoose = require('mongoose')

const Event = mongoose.model('Event', new mongoose.Schema({
  aggregateId: mongoose.Schema.Types.String,
  body: {
    type: mongoose.Schema.Types.String,
    data: mongoose.Schema.Types.Mixed
  },
  version: mongoose.Schema.Types.Number
}))

const create = async item => {
  // TODO validation - either separate schema validation package or mongoose validation...
  const version = await count(item.aggregateId)
  return new Promise((resolve, reject) => {
    new Event({ ...item, version }).save((err, doc) => {
      err ? reject(err) : resolve(doc)
    })
  })
}

const find = comparator => new Promise((resolve, reject) => {
  Event.find(comparator, (err, docs) => {
    err ? reject(err) : resolve(docs)
  })
})

const count = aggregateId => new Promise((resolve, reject) => {
  Event.count({ aggregateId }, (err, count) => {
    err ? reject(err) : resolve(count)
  })
})

module.exports = { create, find, count }
