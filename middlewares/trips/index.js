const express = require('express')
const router = express.Router()

const controller = require('./controller')

// seed or insert initial data
// router.post('/seed', controller.seedTrips)

router.get('/', controller.getTrips)

// router.post('/', auth.isAuthenticated, controller.createTrip)
router.post('/', controller.createTrip)

router.put('/:id/request', controller.requestJoin) // by other user
router.put('/:id/approve', controller.requestApprove) // by author

router.get('/:id', controller.getTripById)
router.delete('/:id', controller.deleteTripById)

module.exports = router
