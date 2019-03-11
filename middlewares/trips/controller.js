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
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedUser = await jwt.verify(token, process.env.SECRET)
      const getUser = await User.findOne({ _id: decodedUser.id })
      if (getUser === null) {
        res.status(401).json({
          message: 'id not there'
        })
      } else {
        if (String(getUser._id) === decodedUser.id) {
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
      }
    } catch (error) {
      res.status(401).json({
        message: 'token not there'
      })
    }
  },
  getTripById: async (req, res, next) => {
    try {
      const getTrip = await Trip.findOne({
        id: req.params.id
      }).populate('id_user', '-password -salt')
      if (getTrip === null) {
        res.status(401).send({
          message: 'Get Trip not there'
        })
      } else {
        res.status(200).send({
          message: 'Get Trip',
          result: getTrip
        })
      }
    } catch (error) {
      res.status(404).send({
        message: 'must to login. to get token'
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
  deleteTripById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedUser = await jwt.verify(token, process.env.SECRET)
    //console.log(decodedUser.id)
    const getTrip = await Trip.findOne({ id: req.params.id })
    if (getTrip === null) {
      res.status(401).send({
        text: `delete trip failed by ${req.params.id} because ${
          req.params.id
        } not there`
      })
    } else {
      if (decodedUser.id == getTrip.id_user) {
        const foundTrip = await Trip.findOneAndRemove({
          id: req.params.id
        })
        res.status(200).send({
          text: `delete trip succsess by ${req.params.id}`,
          foundTrip: foundTrip
        })
      } else {
        res.status(401).send({
          text: `delete trip failed by ${req.params.id}`
        })
      }
    }
  }
}

module.exports = controller
