const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Trip = require('./model')
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
  getTrip: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedUser = await jwt.verify(token, process.env.SECRET)
    if (decodedUser.id) {
      const result = await Trip.findOne({ id: req.params.id })

      res.status(200).send({
        message: 'Get Trip',
        result: result
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
  },
  deleteTrip: async (req, res) => {
    res.status(200).send({
      message: `delete trip by id`
    })
  }
}

module.exports = controller
