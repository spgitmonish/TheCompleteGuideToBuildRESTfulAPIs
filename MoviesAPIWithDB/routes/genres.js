const express = require('express')
const router = express.Router();
const {Genre, validate} = require('../models/genre.js');

// CRUD
router.get('/', async (req, res) => {
  // Send back all the genres read from the database
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  // Check if the genre id exists
  const genre = await Genre.findById(req.params.id);

  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send a response with the genre
  res.send(genre);
});

router.post('/', async (req, res) => {
  // Valiidate the genre
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Add the genre to the list
  const genre = new Genre({ name: req.body.name });
  const genreID = await genre.save();

  // Send a response with the genre
  res.send(genreID);
});

router.put('/:id', async (req, res) => {
  // Valiidate the genre before updating the database
  const { error } = validate(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);
  
  // Using update first approach
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send a response with the genre
  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  // Delete and await the result via a promise
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // Send a 404 error indicate genre not found
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send a response with the genre
  res.send(genre);
});

module.exports = router;