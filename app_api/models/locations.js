const mongoose = require('mongoose');

const openingTimesSchema = new mongoose.Schema({
  days: {
    type: String,
    required: true,
  },
  opening: String,
  closing: String,
  closed: {
    type: Boolean,
    required: true
  }
});

const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    'default': 0,
    min: 0,
    max: 5
  },
  facilities: [ String ],
  coords: {
    type: { type: String },
    coordinates: [ Number ]
  },
  //rating: Number,
  openingTimes: [ openingTimesSchema ],
  reviews: [ reviewSchema ]
});

locationSchema.index({ coords: '2dsphere' });

mongoose.model('Location', locationSchema);
