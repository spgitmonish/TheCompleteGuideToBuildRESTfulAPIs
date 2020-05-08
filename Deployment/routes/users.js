const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const {User, validate} = require('../models/user');
const authenticate = require('../middleware/authenticate');

// CRUD
router.get('/me', authenticate, async (req, res) => {
  // Find the user based on the authentication token and remove certain sensitive properties i.e. password
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  // Valiidate the user
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Make sure the user is not already registered with this email
  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already registered');

  // Validate the password
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  // Generate the salt to hash the password
  const salt = await bcrypt.genSalt(10);
  // Generate a hashed password with the salt 
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();

  // Generate a token to be sent back to the user
  const token = user.generateToken();

  // Send a response with the user with the header having the JWT so that the user can use for
  // other requests to the server
  res.header('x-auth-token', token).send(_.pick(req.body, ['name', 'email']));
});

module.exports = router;