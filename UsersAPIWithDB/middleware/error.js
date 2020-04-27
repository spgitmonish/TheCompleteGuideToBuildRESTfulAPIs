const winston = require('winston');

// This middleware handles only exceptions thrown in the request processing 
// pipeline in express and if something goes wrong outside of express, this middleware
// doesn't handle it
module.exports = function(err, req, res, next) {
  // Log the exception
  winston.error(err.message, err);
  res.status(500).send('Something went wrong');
}