const express = require('express')
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');

// CRUD
router.get('/', async (req, res) => {
  // Send back all the genres read from the database
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  // Check if the movie id exists
  const movie = await Movie.findById(req.params.id);

  // Send a 404 error indicate movie not found
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  // Send a response with the movie
  res.send(movie);
});

router.post('/', async (req, res) => {
  // Valiidate the movie
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Find the genre document associated with the ID
  const genre = await Genre.findById(req.body.genreID);
  if(!genre) return res.status(400).send('Invalid genre');

  // Add the movie to the list
  let movie = new Movie({ 
    title: req.body.title, 
    genre: { // Storing only specific properties of the document as a subdocument
      _id: genre.id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock, 
    dailyRentalRate: req.body.dailyRentalRate });
  movie = await movie.save();

  // Send a response with the movie
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  // Valiidate the movie before updating the database
  const { error } = validate(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);
  
  // Find the genre document associated with the ID
  const genre = await Genre.findById(req.body.genreID);
  if(!genre) return res.status(400).send('Invalid genre')

  // Using update first approach
  const movie = await Movie.findByIdAndUpdate(req.params.id, 
    { title: req.body.title, 
     genre: { // Storing only specific properties of the document as a subdocument
       _id: genre.id,
       name: genre.name
     },
     numberInStock: req.body.numberInStock, 
     dailyRentalRate: req.body.dailyRentalRate }, 
    { new: true });

  // Send a 404 error indicate movie not found
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  // Send a response with the movie
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  // Delete and await the result via a promise
  const movie = await Movie.findByIdAndRemove(req.params.id);

  // Send a 404 error indicate movie not found
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  // Send a response with the movie
  res.send(movie);
});

module.exports = router;