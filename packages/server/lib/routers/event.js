const codec = require('json-url')('lzw')
const Event = require('../../lib/models/event')
const router = require('express').Router()

const findAndRespond = async (comparator, res) => {
  const events = await Event.find(comparator)

  return Array.isArray(events) && events.length > 0
    ? res.json(events)
    : res.status(404).json([])
}

router.route('/').get(async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(404).send('no query parameter found')
    }

    const comparator = await codec.decompress(query)

    return await findAndRespond(comparator, res)
  } catch (err) {
    const message = `${err}`
    console.error(message)
    res.status(500).send(message)
  }
})

router.route('/:aggregateId').get(async (req, res) => {
  try {
    const { aggregateId } = req.params

    const comparator = { aggregateId }

    if (typeof (req.query.version) !== 'undefined') {
      let { version } = req.query
      version = parseInt(version)

      if (isNaN(version)) {
        throw Error('version is not an integer')
      }

      comparator.version = { $lte: version }
    }

    return await findAndRespond(comparator, res)
  } catch (err) {
    const message = `${err}`
    console.error(message)
    res.status(500).send(message)
  }
})

module.exports = router
