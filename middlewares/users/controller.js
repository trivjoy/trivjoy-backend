const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./model')
const controller = {
  getRoot: async (req, res, next) => {
    const foundUser = await User.find()
    res.status(200).send({
      message: 'Users',
      foundUser
    })
  },
  postRegister: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = {
      ...req.body,
      salt: salt,
      password: hashedPassword
    }

    const result = await User.create(newUser)
    res.status(200).send({
      message: 'Register',
      user: {
        name: result.name,
        email: result.email
      }
    })
  },
  postLogin: async (req, res, next) => {
    const user = {
      ...req.body
    }
    // console.log(user)
    const foundUser = await User.findOne({ email: user.email }, null, {
      lean: true
    })
    // console.log(foundUser)
    const comparePassword = await bcrypt.compare(
      user.password,
      foundUser.password
    )
    if (comparePassword === false) {
      res.status(401).send({
        error: 'error'
      })
    } else {
      const { password, salt, ...user } = foundUser
      console.log(foundUser)

      // console.log(payload)
      const token = await jwt.sign({ id: user._id }, process.env.SECRET)
      // console.log('token : ', token)
      res.status(200).send({
        message: 'Login',
        // authenticated: comparePassword,
        token: token
      })
    }
  },

  getProfile: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)

    const decodedUser = await jwt.verify(token, process.env.SECRET)
    console.log(decodedUser)

    if (decodedUser.id) {
      const foundUser = await User.findById(decodedUser.id, {
        salt: 0,
        password: 0
      })
      console.log(foundUser)
      res.status(200).send({
        message: 'Get my profile',
        User: foundUser
      })
    }
  },
  getUserById: async (req, res, next) => {
    const foundUser = await User.findOne({ _id: req.params.id })

    const user = {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone,
      gender: foundUser.gender,
      city: foundUser.city,
      avatar: foundUser.avatar,
      age: foundUser.age
    }

    res.status(200).send({
      text: 'success',
      foundUser: user
    })
  },
  deleterUserById: async (req, res, next) => {
    const foundUser = await User.findOneAndRemove({ _id: req.params.id })
    if (foundUser === null) {
      res.status(401).send({
        text: `deleted failed`
      })
    } else {
      res.status(200).send({
        text: `delete by ${req.params.id} sucess`,
        foundUser
      })
    }
  }
}

module.exports = controller
