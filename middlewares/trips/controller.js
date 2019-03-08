const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Trip = require('./model')
const helpers = require('../../helpers')
const controller = {
  getRoot: (req, res, next) => {
    res.status(200).send({
      message: 'Trip'
    })
  },
  postTrip: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = await helpers.verifyToken(token)

    if (decodedToken.id) {
      const newTrip = {
     ...req.body
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
    const result = await Trip.findOne()
    res.status(200).send({
      message: 'Get Trip',
      result: result
    })
  }
}

module.exports = controller
