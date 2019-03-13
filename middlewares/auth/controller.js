const helpers = require('../../helpers')

const User = require('../users/model')

const authControllers = {
  //////////////////////////////////////////////////////////////////////////////
  // GET TOKEN
  isAuthenticated: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = await helpers.verifyToken(token)

      req.token = token
      req.decoded = decoded

      next()
    } catch (error) {
      // If failed to get the token
      res.send({
        message: 'Token is not exist in headers of Authorization'
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  // CHECK IF USER ALREADY EXIST
  isUserExist: async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    const searchUser = await User.find({}, { salt: 0, password: 0 })
    const userExist = searchUser.find(user => {
      return req.body.email === user.email || req.body.phone === user.phone
    })
    // if user does not exist, you can continue
    if (!userExist) {
      next()
    } else {
      res.status(401).send({
        message: 'User is already exist with that email!'
      })
    }
  }
}

module.exports = authControllers
