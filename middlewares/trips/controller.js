const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Trip = require('./model')

const controller = {
  //////////////////////////////////////////////////////////////////////////////
  getTrips: async (req, res, next) => {
    res.status(200).send({
      message: 'Get all trips',
      trips: await Trip.find()
    })
  },

  //////////////////////////////////////////////////////////////////////////////
  createTrip: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = await jwt.verify(token, process.env.SECRET)

      const newTrip = {
        ...req.body,
        author: decoded.sub
      }

      const result = await Trip.create(newTrip)

      res.status(200).send({
        message: 'Created trip',
        result: result
      })
    } catch (error) {
      res.status(401).json({
        message: 'You are not authorized'
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  getTripById: async (req, res, next) => {
    const result = await Trip.findOne({
      id: Number(req.params.id)
    }).populate('author', '-salt -password')

    if (!result) {
      res.status(401).send({
        message: 'Trip does not exist'
      })
    } else {
      res.status(200).send({
        message: 'Get trip by id',
        result: result
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  deleteTripById: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await jwt.verify(token, process.env.SECRET)
    const result = await Trip.findOne({ id: Number(req.params.id) })

    if (!result) {
      res.status(401).send({
        message: 'Trip is not found'
      })
    } else {
      if (decoded.sub === String(result.author._id)) {
        const deletedTrip = await Trip.findOneAndRemove({
          id: Number(req.params.id)
        })

        res.status(200).send({
          text: `Deleted trip success`,
          deletedTrip: deletedTrip
        })
      } else {
        res.status(401).send({
          text: `You are not authorized to delete this trip`
        })
      }
    }
  }
}

module.exports = controller
