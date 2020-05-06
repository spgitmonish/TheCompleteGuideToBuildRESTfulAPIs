const mongoose = require('mongoose');
const genreSchema = require('./genre.js');
const Joi = require('joi');

// Schema representing a movie in the collection
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 20
  }, 
  // Schema type object for embedding documents
  genre: {
    type: genreSchema,
    required: true 
  }, 
  numberInStock: {
    type: Number,
    require: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    require: true,
    min: 0,
    max: 255
  }
});

// Create model from schema
const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).max(20).required(),
    genreID: Joi.string().required(), // The client sends the genreID but we save the genre subdocument as part of the movie dovument
    numberInStock: Joi.number().integer().min(0).max(255).required(),
    dailyRentalRate: Joi.number().integer().min(0).max(255).required()
  }

  // Validate the movie
  return Joi.validate(movie, schema);
};

module.exports.Movie = Movie;
module.exports.validate = validateMovie;