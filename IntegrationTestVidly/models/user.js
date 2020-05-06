const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('../models/password');

// Schema representing a user in the collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 10,
    max: 30,
  },
  isAdmin: Boolean
});

// Add function to the user schema 
userSchema.methods.generateToken = function() {
  // Pick the properties from the user schema object
  // NOTE: 'jwtSecretPrivateKey' is the name of the application setting, the actual value 
  //       will be in a environment variable
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtSecretPrivateKey'));
  return token;
}

// Create model from schema
const User = mongoose.model('User', userSchema);

function validateUser(user) {  
  // This is validating the input
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password: passwordComplexity.required()
  }

  // Validate the user
  return Joi.validate(user, schema);
};

module.exports.User = User;
module.exports.validate = validateUser;
