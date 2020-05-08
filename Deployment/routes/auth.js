const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('Joi');
const router = express.Router();
const {User} = require('../models/user');
const passwordComplexity = require('../models/password');

// CRUD
router.post('/', async (req, res) => {
  // Valiidate the user
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Make sure the user exists in the system
  const user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password');

  // Make sure the password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');

  // Generate a token
  const token = user.generateToken();

  // Return the token to the client
  return res.send(token);
});

function validate(user) {
  // This is validating the input
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: passwordComplexity.required()
  }

  // Validate the user
  return Joi.validate(user, schema);
};

module.exports = router;