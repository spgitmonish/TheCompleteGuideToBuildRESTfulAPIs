const config = require('config');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Check if the configuration setting is defined 
if(!config.get('jwtSecretPrivateKey')) {
  console.error('FATAL ERROR: jwtSecretPrivateKey is not defined');
  // Exit the environment variable
  process.exit(1);
}

// Connect to the data base
mongoose.connect('mongodb://localhost/vidly')
  .then(() => { console.log("Connected to database") })
  .catch((error) => { console.error("Not able to connect to the database") });

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

// Use the environment variable or the 3000 for the port
const port = process.env.PORT || 3000;
// NOTE: Template literals are string literals allowing embedded expressions, they start and end with a back tick
app.listen(port, () => console.log(`Listening on port ${port}...`));