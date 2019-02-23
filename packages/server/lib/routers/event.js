const codec = require('json-url')('lzw')
const Event = require('../../lib/models/event')
const router = require('express').Router()

router.route('/').get(async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(404).send('no query parameter found')
    }

    const comparator = await codec.decompress(query)
    const events = await Event.find(comparator)

    return events && Array.isArray(events) && events.length > 0
      ? res.json(events)
      : res.status(404).json([])
  } catch (err) {
    const message = `${err}`
    console.error(message)
    res.status(500).send(message)
  }
})

module.exports = router
