const express = require('express')
const router = express.Router()

const controller = require('./controller')
const auth = require('../auth/controller')

router.get('/', controller.getUsers)

router.post('/register', auth.isUserExist, controller.register)
router.post('/login', controller.login)
router.get('/profile', auth.isAuthenticated, controller.getProfile)
router.get('/logout', controller.logout)

router.get('/:id', controller.getUserById)
router.delete('/:id', auth.isAuthenticated, controller.deleteUserById)
router.put('/:id', auth.isAuthenticated, controller.updateUserById)

module.exports = router
