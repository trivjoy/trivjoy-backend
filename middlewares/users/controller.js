const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./model')

const controller = {
  //////////////////////////////////////////////////////////////////////////////
  getUsers: async (req, res, next) => {
    const users = await User.find({})

    if (users.length === 0) {
      res.status(200).send({
        message: 'Users not found'
      })
    } else {
      res.status(200).send({
        message: 'Users',
        users: users
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  register: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = {
      ...req.body,
      salt: salt,
      password: hashedPassword
    }

    const searchUser = await User.find({}, { salt: 0, password: 0 })
    const userExist = searchUser.find(user => {
      return req.body.email === user.email || req.body.phone === user.phone
    })

    if (!userExist) {
      const result = await User.create(newUser)

      res.status(200).send({
        message: 'Register success',
        user: {
          name: result.name,
          email: result.email
        }
      })
    } else {
      res.status(401).send({
        message: 'Register failed',
        user: 'User already exist'
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  login: async (req, res, next) => {
    const user = {
      ...req.body
    }

    const foundUser = await User.findOne({ email: user.email }, null, {
      lean: true
    })

    if (foundUser === null) {
      res.status(401).send({
        message: 'User not found'
      })
    } else {
      const comparePassword = await bcrypt.compare(
        user.password,
        foundUser.password
      )

      if (comparePassword === false) {
        res.status(401).send({
          message: 'Login failed'
        })
      } else {
        const token = await jwt.sign(
          {
            sub: foundUser._id,
            id: foundUser.id
          },
          process.env.SECRET
        )

        res.status(200).send({
          message: 'Login success',
          token: token
        })
      }
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  getProfile: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedUser = await jwt.verify(token, process.env.SECRET)

      const foundUser = await User.findById(decodedUser.sub, {
        salt: 0,
        password: 0
      })
      res.status(200).send({
        message: 'Get my profile',
        User: foundUser
      })
    } catch (err) {
      res.status(404).send({
        message: 'failed'
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  getUserById: async (req, res, next) => {
    if (!Number(req.params.id)) {
      res.status(400).send({
        message: 'ID is not a number'
      })
    } else {
      const user = await User.findOne(
        { id: req.params.id },
        { salt: 0, password: 0 }
      )

      if (user === null) {
        res.status(400).send({
          message: 'User not found'
        })
      } else {
        res.status(200).send({
          message: 'Get one user by id',
          user: user
        })
      }
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  deleteUserById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await jwt.verify(token, process.env.SECRET)

    try {
      const foundUser = await User.findOne({ id: Number(req.params.id) })

      if (foundUser.id !== decoded.id) {
        res.status(401).send({
          message: `You are not allowed to delete that user`
        })
      } else {
        const removedUser = await User.findOneAndRemove(
          {
            id: req.params.id
          },
          { salt: 0, password: 0 }
        )

        res.status(200).send({
          message: 'Delete user success',
          removedUser: removedUser
        })
      }
    } catch (error) {
      res.send({
        message: 'User not found'
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  updateUserById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    try {
      const decoded = await jwt.verify(token, process.env.SECRET)
      const foundUser = await User.findOne({ id: Number(req.params.id) })

      if (foundUser.id !== decoded.id) {
        res.status(401).send({
          message: 'You are not authorized to update this user'
        })
      } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const updatedUser = {
          ...req.body,
          salt: salt,
          password: hashedPassword
        }

        const foundUser = await User.findOneAndUpdate(
          { id: Number(req.params.id) },
          { $set: updatedUser },
          {
            fields: { salt: 0, password: 0 }, // exclude secrets
            new: true // the latest update
          }
        )

        res.status(200).send({
          text: `Updated user success`,
          foundUser: foundUser
        })
      }
    } catch (error) {
      res.send({
        message: 'You are not authenticated'
      })
    }
  }
}

module.exports = controller
