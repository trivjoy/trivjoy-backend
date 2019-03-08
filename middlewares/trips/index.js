const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.get('/', controller.getRoot)
router.post('/addtrip', controller.postTrip)
router.get('/card', controller.getTrip)

module.exports = router
