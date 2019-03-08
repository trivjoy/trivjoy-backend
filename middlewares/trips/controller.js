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
    console.log(req.body)
    const newTrip = {
      name: req.body.name,
      email: req.body.email
    }
    const result = await Trip.create(newTrip)
    res.status(200).send({
      message: 'Add Trip',
      result: result
    })
  },
  getTrip: async (req, res, next) => {
    const result = await Trip.findOne()
    res.status(200).send({
      message: 'Get Trip',
      result: result
    })
  }
}

module.exports = controller
