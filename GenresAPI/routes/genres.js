const express = require('express')
const router = express.Router();
const Joi = require('joi');

const genres = [
  { id: 1, name: 'Action' },  
  { id: 2, name: 'Horror' },  
  { id: 3, name: 'Romance' },  
];

router.get('/', (req, res) => {
  // Send back all the genres
  res.send(genres);
});

router.get('/:id', (req, res) => {
  // Check if the genre id exists
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send a response with the genre
  res.send(genres[req.params.id]);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;