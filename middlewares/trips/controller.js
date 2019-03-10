const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Trip = require('./model')
const User = require('../users/model')
const controller = {
  getRoot: (req, res, next) => {
    res.status(200).send({
      message: 'Trip'
    })
  },
  postTrip: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    const decodedUser = await jwt.verify(token, process.env.SECRET)

    if (decodedUser.id) {
      const newTrip = {
        ...req.body,
        id_user: decodedUser.id
      }
      const result = await Trip.create(newTrip)
      res.status(200).send({
        message: 'Add Trip',
        result: result
      })
    } else {
      res.status(401).json({})
    }
  },
  getTripById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedUser = await jwt.verify(token, process.env.SECRET)
    if (decodedUser.id) {
      const getTrip = await Trip.findOne({ id: req.params.id })
      const getUser = await User.findOne({ _id: decodedUser.id })

      const resultUser = {
        name: getUser.name,
        email: getUser.email,
        phone: getUser.phone,
        gender: getUser.gender,
        city: getUser.city,
        avatar: getUser.avatar,
        age: getUser.age
      }

      res.status(200).send({
        message: 'Get Trip',
        result: [{ Trip: getTrip }, { User: resultUser }]
      })
    } else {
      res.status(401).send({
        message: 'Error'
      })
    }
  },
  getTrips: async (req, res, next) => {
    const result = await Trip.find()
    res.status(200).send({
      message: 'Get Trip',
      result: result
    })
  }
}

module.exports = controller
