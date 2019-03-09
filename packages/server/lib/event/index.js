const Event = require('./model')
const { promisify } = require('util')

const find = promisify(Event.find)

const count = aggregateId => new Promise((resolve, reject) => {
  Event.count({ aggregateId }, (err, count) => {
    err ? reject(err) : resolve(count)
  })
})

const create = async item => {
  const version = await count(item.aggregateId)
  const event = new Event({
    ...item,
    version
  })
  const save = promisify(event.save)
  return save()
}

module.exports = {
  create,
  find,
  count
}
