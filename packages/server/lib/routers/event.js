const bodyParser = require('body-parser')
const codec = require('json-url')('lzw')
const Event = require('../../lib/models/event')
const router = require('express').Router()

const catchAnd500 = async (res, func) => {
  try {
    await func()
  } catch (err) {
    const message = `${err}`
    console.error(message)
    return res.status(500).send(message)
  }
}

const findAndRespond = async (comparator, res) => {
  const events = await Event.find(comparator)

  return Array.isArray(events) && events.length > 0
    ? res.json(events)
    : res.status(404).json([])
}

const permittedBodyKeys = [ 'type', 'data' ]
const invalidEventMessage = 'invalid event ( it shouild be { type: <some_string>, data: <some_optional_data> } only )'

router.use(bodyParser.json())

router.route('/')
  .get(async (req, res) => {
    catchAnd500(res, async () => {
      const { query } = req.query

      if (!query) {
        return res.status(404).send('no query parameter found')
      }

      const comparator = await codec.decompress(query)

      return findAndRespond(comparator, res)
    })
  })

router.route('/:aggregateId')
  .get(async (req, res) => {
    catchAnd500(res, async () => {
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

      return findAndRespond(comparator, res)
    })
  })
  .post(async (req, res) => {
    catchAnd500(res, async () => {
      const { aggregateId } = req.params
      const body = req.body

      if (!body || !body.type || Object.keys(body).some(key => !permittedBodyKeys.includes(key))) { // TODO validate properly!!
        console.error(invalidEventMessage)
        return res.status(400).send(invalidEventMessage)
      }

      const event = await Event.create({ aggregateId, body })

      return res.json(event)
    })
  })

module.exports = router
