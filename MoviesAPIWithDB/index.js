const home = require('./routes/home.js');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to the data base
mongoose.connect('mongodb://localhost/vidly')
  .then(() => { console.log("Connected to database") })
  .catch((error) => { console.error("Not able to connect to the database") });

// Middleware
// NOTE: The order of the middleware matters!
app.use(express.json()); // To indicate that the input is a JSON object
app.use('/', home)
app.use('/api/genres', genres) // Use the cutomers router object for all the routes starting with /api/genres
app.use('/api/customers', customers) // Use the cutomers router object for all the routes starting with /api/customers
app.use('/api/movies', movies) // Use the cutomers router object for all the routes starting with /api/movies

// Use the environment variable or the 3000 for the port
const port = process.env.PORT || 3000;
// NOTE: Template literals are string literals allowing embedded expressions, they start and end with a back tick
app.listen(port, () => console.log(`Listening on port ${port}...`));