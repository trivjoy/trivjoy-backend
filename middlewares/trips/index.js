const express = require('express')
const router = express.Router()

const controller = require('./controller')

// seed or insert initial data
router.post('/seed', controller.seedTrips)

router.get('/', controller.getTrips)
router.post('/', controller.createTrip)

router.put('/:id/request', controller.getTrips) // by other user
router.put('/:id/approve', controller.getTrips) // by author

router.get('/:id', controller.getTripById)
router.delete('/:id', controller.deleteTripById)

module.exports = router
