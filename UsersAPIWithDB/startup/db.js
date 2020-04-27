const winston = require('winston');
const mongoose = require('mongoose');

// Connect to the data base
module.exports = function() {
  mongoose.connect('mongodb://localhost/vidly')
  .then(() => { winston.log("Connected to database") });
};