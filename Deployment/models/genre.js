const mongoose = require('mongoose');
const Joi = require('joi');

// Schema representing a movie in the collection
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 5,
    maxLength: 50
  }
});

// Create model from schema
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  }

  return Joi.validate(genre, schema);
};

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;