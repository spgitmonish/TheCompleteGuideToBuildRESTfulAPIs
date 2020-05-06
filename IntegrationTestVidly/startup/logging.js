require('express-async-errors');
require('winston-mongodb');
const winston = require('winston');

module.exports = function() {

  winston.add(winston.transports.File, { filename: 'errors.log' });
  winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });

  // Uncaught exception handling and exit the process
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'exceptions.log' }));

  // Unhandled promise rejection and exit the process
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
};