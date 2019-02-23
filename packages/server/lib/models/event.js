const mongoose = require('mongoose')

const Event = mongoose.model('Event', new mongoose.Schema({
  aggregateId: mongoose.Schema.Types.String,
  data: mongoose.Schema.Types.Mixed,
  version: mongoose.Schema.Types.Number
}))

module.exports.create = item => new Promise((resolve, reject) => {
  new Event(item).save((err, doc) => {
    err ? reject(err) : resolve(doc)
  })
})
module.exports.read = comparator => new Promise((resolve, reject) => {
  Event.find(comparator, (err, docs) => {
    err ? reject(err) : resolve(docs)
  })
})
module.exports.count = aggregateId => new Promise((resolve, reject) => {
  Event.count({ aggregateId }, (err, count) => {
    err ? reject(err) : resolve(count)
  })
})
