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

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  // Valiidate the genre
  const { error } = validateGenre(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Add the new genre
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  // Add to the list
  genres.push(genre);
  // Send a response with the genre added
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  // Check if the genre exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Validate the genre
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // Send a respsonse with the genre
  genre.name = req.body.name; 
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  // Check if the genre exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Remove the genre from the object
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // Send a reponse with the deleted genre
  res.send(genre);  
});

app.get('/api/genres/:id', (req, res) => {
  // Check if the genre exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  // Send a response with the genre
  res.send(genre);
});

// Common API for validating input using a schema
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));