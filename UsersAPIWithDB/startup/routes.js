const express = require('express');
const home = require('../routes/home');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  // Middleware
  // NOTE: The order of the middleware matters!
  app.use(express.json()); // To indicate that the input is a JSON object

  // Define the routes and the objects which handle the routes
  app.use('/', home);
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users); 
  app.use('/api/auth', auth);
  // This middleware needs to be after all the other middleware
  app.use(error);
}