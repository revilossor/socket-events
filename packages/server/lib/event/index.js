const Event = require('./model')

const count = aggregateId => Event.countDocuments({ aggregateId })

const create = async item => {
  const version = await count(item.aggregateId) // TODO might be a way to get mongo to do this, and resolve conflicts...
  const event = new Event({
    ...item,
    version
  })
  const { body } = await event.save()
  return { body, version }
}

module.exports = {
  create,
  find: query => {
    return Event.find(query, { _id: 0, __v: 0, aggregateId: 0 })
  },
  count
}
