const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./model')
const controller = {
  getRoot: (req, res, next) => {
    res.status(200).send({
      message: 'Users'
    })
  },
  postRegister: async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      city: req.body.city,
      avatar: req.body.avatar,
      age: req.body.age,
      address: req.body.address,
      about: req.body.about,
      salt: salt,
      password: hashedPassword
    }
    const result = await User.create(newUser)
    res.status(200).send({
      message: 'Register',
      user: result
    })
  },
  postLogin: async (req, res, next) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }
    // console.log(user)
    const foundUser = await User.findOne({ email: user.email })
    console.log(foundUser)
    const comparePassword = await bcrypt.compare(
      user.password,
      foundUser.password
    )
    // console.log(comparePassword)
    const payload = {
      sub: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone,
      gender: foundUser.male,
      city: foundUser.city,
      avatar: foundUser.avatar,
      age: foundUser.age
    }
    // console.log(payload)
    const token = await jwt.sign(payload, process.env.SECRET)
    // console.log('token : ', token)
    res.status(200).send({
      message: 'Login',
      authenticated: comparePassword,
      token: token
    })
  },
  getProfile: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)

    const decodedUser = await jwt.verify(token, process.env.SECRET)
    console.log(decodedUser)

    if (decodedUser.sub) {
      const foundUser = await User.findById(decodedUser.sub, {
        salt: 0,
        password: 0
      })
      // console.log(foundUser)
    }

    res.status(200).send({
      message: 'Get my profile',
      decodedUser: decodedUser
    })
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
  }
}

module.exports = controller
