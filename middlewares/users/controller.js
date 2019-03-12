const User = require('./model')
const auth = require('../auth/controller')

const controller = {
  //////////////////////////////////////////////////////////////////////////////
  getUsers: async (req, res, next) => {
    const users = await User.find({}, { salt: 0, password: 0 })

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
    const { salt, password } = await auth.encryptPassword(req.body.password)

    const newUser = {
      ...req.body,
      salt,
      password
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
  login: async (req, res) => {
    const userLogin = {
      ...req.body
    }

    const foundUser = await User.findOne({ email: userLogin.email })

    if (foundUser === null) {
      res.status(401).send({
        message: 'User not found'
      })
    } else {
      const authenticated = await auth.comparePassword(
        userLogin.password,
        foundUser.password
      )

      if (authenticated === false) {
        res.status(401).send({
          message: 'Login failed'
        })
      } else {
        const token = await auth.createToken(foundUser)
        const { password, salt, ...user } = foundUser
        res.status(200).send({
          message: 'Login success',
          token: token,
          user
        })
      }
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  getProfile: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]

      const decoded = await auth.verifyToken(token, process.env.SECRET)

      const foundUser = await User.findById(decoded.sub, {
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

  logout: async (req, res) => {
    res.send({
      message: 'Logged out the user'
    })
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
    const decoded = await auth.verifyToken(token, process.env.SECRET)
    const foundUser = await User.findOne({ id: Number(req.params.id) })
    if (!foundUser) {
      res.status(401).send({
        message: `user not there`
      })
    } else {
      if (String(foundUser._id) === decoded.sub) {
        res.status(401).send({
          message: `You are not allowed to delete that user`
        })
      } else {
        const removedUser = await User.findOneAndRsemove(
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
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  updateUserById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await auth.verifyToken(token, process.env.SECRET)
    const foundUser = await User.findOne({ id: Number(req.params.id) })
    if (foundUser.id !== decoded.id) {
      res.status(401).send({
        message: 'You are not authorized to update this user'
      })
    } else {
      const { salt, password } = await auth.encryptPassword(req.body.password)

      const updatedUser = {
        ...req.body,
        salt,
        password
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
  }
}

module.exports = controller
