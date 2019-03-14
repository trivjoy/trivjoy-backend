require('dotenv').config()
const mongoose = require('../../config/mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema

// User schema
const SeedSchema = Schema({
  title: String,
  tourDestination: String,
  dateFrom: Date,
  dateTo: Date,
  budget: Number,
  image: String,
  description: String,
  peopleMin: Number,
  peopleMax: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  users_requested: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  users_joined: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

// plug the AutoIncrement plugin into the schema to create auto incremented id
// id is different with _id
// inc_field is to track which id to increment
SeedSchema.plugin(AutoIncrement, {
  id: 'seed_counter',
  inc_field: 'id'
})

// User model => users collection
const Seed = mongoose.model('Seed', SeedSchema)

module.exports = Seed
