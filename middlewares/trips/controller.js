const Trip = require('./model')
const Seed = require('./dataDummy')
const auth = require('../../helpers')

const controller = {
  //////////////////////////////////////////////////////////////////////////////
  getTrips: async (req, res, next) => {
    const Trips = await Trip.find().populate('author', '-salt -password')

    if (Trips.length === 0) {
      res.status(200).send({
        message: 'Get all trips dummy',
        trips: Seed
      })
    } else {
      res.status(200).send({
        message: 'Get all trips',
        trips: await Trip.find().populate('author', '-salt -password')
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  createTrip: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await auth.verifyToken(token, process.env.SECRET)
    if (!decoded.sub) {
      res.status(401).send({
        message: 'Wrong created trip'
        // result: result
      })
    } else {
      const newTrip = {
        ...req.body,
        author: decoded.sub
      }

      const result = await Trip.create(newTrip)
      res.status(200).send({
        message: 'Created trip',
        result: result
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  getTripById: async (req, res, next) => {
    const result = await Trip.findOne({
      id: Number(req.params.id)
    })
      .populate('author', '-salt -password')
      .populate('users_requested', '-salt -password')
      .populate('users_joined', '-salt -password')

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
    const decoded = await auth.verifyToken(token, process.env.SECRET)
    const result = await Trip.findOne({ id: Number(req.params.id) })
    console.log(result)

    if (!result) {
      res.status(401).send({
        message: 'Trip is not found'
      })
    } else if (String(result.author) !== decoded.sub) {
      res.status(401).send({
        message: 'user not there trip'
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
  },

  //////////////////////////////////////////////////////////////////////////////
  requestJoin: async (req, res, next) => {
    const result = await Trip.findOne({ id: Number(req.params.id) })

    if (String(result.author) !== req.decoded.sub) {
      const newTrip = await Trip.findOneAndUpdate(
        {
          // find the number id
          id: Number(req.params.id),
          // only if the user does not exist yet in users_requested array
          users_requested: { $ne: req.decoded.sub }
        },
        // add token's sub to users_requested array
        { $push: { users_requested: req.decoded.sub } },
        { new: true }
      )

      if (newTrip) {
        res.status(200).send({
          message: 'Request join',
          user_requested: req.decoded.sub,
          newTrip
        })
      } else {
        res.status(400).send({
          message: 'Request join failed. You already requested'
        })
      }
    } else {
      res.status(401).send({
        message: 'Request join failed because you are the trip author'
      })
    }
  },
  ///////////////////////////////////////////////////////////////////////////

  requestApprove: async (req, res, next) => {
    try {
      const trip = await Trip.findOne({
        id: req.params.id,
        users_joined: { $ne: req.body.approvedUser }
      }).populate('author')

      if (String(trip.author._id) !== req.decoded.sub) {
        throw 'approve failed because you are not trip author'
      }

      if (trip) {
        trip.users_requested = trip.users_requested.filter(id => {
          return id.toString() !== req.body.approvedUser
        })
        trip.users_joined.push(req.body.approvedUser)
        trip.save()
        res.status(200).send({
          message: 'Request Approve',
          updatedTrip: trip
        })
      } else {
        throw 'error'
      }
    } catch (err) {
      console.log(err)

      res.status(400).send({
        message: 'Error'
      })
    }
  }
}
//////////////////////////////////////////////////////////////////////////////

module.exports = controller
