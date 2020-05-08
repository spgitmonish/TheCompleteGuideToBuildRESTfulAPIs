const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

// Connect to the data base
module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db)
  .then(() => { winston.log(`Connected to ${db}`) });
};