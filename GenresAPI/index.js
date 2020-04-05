const Joi = require('joi');
const express = require('express');
const app = express();

// To indicate that the input is a JSON object
app.use(express.json());

const genres = [
  { id: 1, name: 'Action' },  
  { id: 2, name: 'Horror' },  
  { id: 3, name: 'Romance' },  
];

app.get('/', (req, res) => {
  res.send('Welcome to the genres page!!');
});

app.get('/api/genres', (req, res) => {
  // Send back all the genres
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  // Check if the genre id exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send a response with the genre
  res.send(genres[req.params.id]);
});

app.post('/api/genres', (req, res) => {
  // Valiidate the genre
  const { error } = validateGenre(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Add the genre to the list
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);

  // Send a response with the genre
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  // Check if the genre id exists
  // NOTE: The properties of a const object can change but it cannot be reassigned 
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Valiidate the genre
  const { error } = validateGenre(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Update the genre name
  genre.name = req.body.name;

  // Send a response with the genre
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  // Check if the genre id exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Remove the genre from the list
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // Send a response with the genre
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }

  return Joi.validate(genre, schema);
};

// Use the environment variable or the 3000 for the port
const port = process.env.PORT || 3000;
// NOTE: Template literals are string literals allowing embedded expressions, they start and end with a back tick
app.listen(port, () => console.log(`Listening on port ${port}...`));