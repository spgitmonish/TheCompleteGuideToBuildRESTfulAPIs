const express = require('express');
const app = express();
const routes = require('./startup/routes');
const db = require('./startup/db');
const logging = require('./startup/logging');
const config = require('./startup/config');
const winston = require('winston');
const prod = require('./startup/prod');

// Setup logging 
logging();

// Setup the route handlers 
routes(app);

// Setup connection to database 
db();

// Setup configuration
config();

// Setup production middleware for the app
prod(app);

// Use the environment variable or the 3000 for the port
const port = process.env.PORT || 3000;
// NOTE: Template literals are string literals allowing embedded expressions, they start and end with a back tick
const server = app.listen(port, () => winston.log(`Listening on port ${port}...`));

module.exports = server