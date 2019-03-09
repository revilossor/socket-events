const event = require('../event')
const router = require('express').Router()

router.route('/:id')
  .get((req, res, next) => {
    event
      .find({
        aggregateId: req.params.id,
        version: req.query.v
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

router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.stack)
})

module.exports = router
