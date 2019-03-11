const event = require('../event')
const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.route('/:id')
  .get((req, res, next) => {
    event
      .find({
        aggregateId: req.params.id,
        ...(req.query.hasOwnProperty('v') && { version: { $lte: req.query.v } })
      })
      .then(result => {
        res.status(
          result.length > 0
            ? 200
            : 404
        ).json(result)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    event
      .create({
        aggregateId: req.params.id,
        body: req.body
      })
      .then(result => {
        res.json(result)
      })
      .catch(next)
  })

router.route('/version/:id')
  .get((req, res, next) => {
    event
      .count(req.params.id)
      .then(version => res.send(`${version}`))
      .catch(next)
  })

router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.stack)
})

module.exports = router
