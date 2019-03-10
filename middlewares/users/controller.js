const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./model')
const controller = {
  getRoot: async (req, res, next) => {
    const foundUser = await User.find()
    if (foundUser.length === 0) {
      res.status(200).send({
        message: 'Users',
        users: null
      })
    } else {
      const allUser = foundUser.map(user => {
        users = {
          name: user.name
        }
        return users
      })
      res.status(200).send({
        message: 'Users',
        users: allUser
      })
    }
  },
  postRegister: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = {
      ...req.body,
      salt: salt,
      password: hashedPassword
    }

    const searchUser = await User.find()
    const filterUser = searchUser.filter(user => {
      return req.body.email === user.email || req.body.phone === user.phone
    })
    if (filterUser.length === 0) {
      const result = await User.create(newUser)
      res.status(200).send({
        message: 'Register',
        user: {
          name: result.name,
          email: result.email
        }
      })
    } else {
      res.status(401).send({
        message: 'Register',
        user: 'data already exists'
      })
    }
  },
  postLogin: async (req, res, next) => {
    const user = {
      ...req.body
    }
    const foundUser = await User.findOne({ email: user.email }, null, {
      lean: true
    })

    if (foundUser === null) {
      res.status(401).send({
        message: 'User Not found'
      })
    } else {
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
        const token = await jwt.sign({ id: user._id }, process.env.SECRET)
        res.status(200).send({
          message: 'Login',
          token: token
        })
      }
    }
  },

  getProfile: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedUser = await jwt.verify(token, process.env.SECRET)

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
    if (!Number(req.params.id)) {
      res.status(400).send({
        message: 'Not Number'
      })
    } else {
      const foundUser = await User.findOne({ id: req.params.id })
      if (foundUser === null) {
        res.status(400).send({
          message: 'fail message',
          foundUser: 'User not exists'
        })
      } else {
        const user = {
          id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          gender: foundUser.gender,
          city: foundUser.city,
          avatar: foundUser.avatar,
          age: foundUser.age
        }

        res.status(200).send({
          message: 'success',
          foundUser: user
        })
      }
    }
  },
  deleterUserById: async (req, res, next) => {
    const foundUser = await User.findOneAndRemove({ id: req.params.id })
    if (foundUser === null) {
      res.status(401).send({
        text: `deleted failed`
      })
    } else {
      res.status(200).send({
        text: `delete user from id : ${req.params.id} sucess`,
        user: foundUser.name
      })
    }
  },
  updateUserById: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const updateUser = {
      ...req.body,
      salt: salt,
      password: hashedPassword
    }
    const foundUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateUser },
      (err, doc) => {
        if (err) {
          return err
        }
        return doc
      }
    )
    const resultUser = {
      ...foundUser._doc,
      salt: null,
      password: null
    }
    res.status(200).send({
      text: `update by ${req.params.id} sucess`,
      resultUser
    })
  }
}

module.exports = controller
