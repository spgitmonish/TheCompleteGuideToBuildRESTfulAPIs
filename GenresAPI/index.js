const genres = require('./routes/genres.js');
const home = require('./routes/home.js');
const express = require('express');
const app = express();

// Middleware
// NOTE: The order of the middleware matters!
app.use(express.json()); // To indicate that the input is a JSON object
app.use('/', home) // Use the home router object for all the route /
app.use('/api/genres', genres) // Use the genres router object for all the routes starting with /api/genres

// Use the environment variable or the 3000 for the port
const port = process.env.PORT || 3000;
// NOTE: Template literals are string literals allowing embedded expressions, they start and end with a back tick
app.listen(port, () => console.log(`Listening on port ${port}...`));