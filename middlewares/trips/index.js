const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.get('/', controller.getRoot)
router.post('/', controller.postTrip)
router.get('/', controller.getTrip)

module.exports = router
