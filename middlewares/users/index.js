const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.get('/', controller.getRoot)
router.post('/register', controller.postRegister)
router.post('/login', controller.postLogin)
router.get('/profile', controller.getProfile)
router.get('/:id', controller.getUserById)
router.delete('/:id', controller.deleterUserById)

module.exports = router
