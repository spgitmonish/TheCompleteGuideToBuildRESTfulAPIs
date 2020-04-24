const express = require('express')
const router = express.Router();
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

// CRUD
router.get('/', async (req, res) => {
  // Send back all the rentals read from the database
  const rentals = await Rental.find().sort('name');
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  // Check if the rental id exists
  const rental = await Rental.findById(req.params.id);

  // Send a 404 error indicate rental not found
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  // Send a response with the rental
  res.send(rental);
});

router.post('/', async (req, res) => {
  // Valiidate the rental
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Find the customer document associated with the ID
  const customer = await Customer.findById(req.body.customerID);
  if(!customer) return res.status(400).send('Invalid customer');
  
  // Find the movie document associated with the ID
  let movie = await Movie.findById(req.body.movieID);
  if(!movie) return res.status(400).send('Invalid movie');

  // Check if the movie is in stock
  if(movie.numberInStock == 0) return res.status(400).send('Movie not in stock');

  // Add the movie to the list
  let rental = new Rental({ 
    customer: {
      _id: customer.id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();

  // Decrement the number in stock and save the movie
  movie.numberInStock -= 1;
  movie = await movie.save(); // There is a chance this can fail
  if(!movie) return res.status(400).send('Could not save movie to movies collection in the database');

  // Send a response with the rental
  res.send(rental);
});

router.put('/:id', async (req, res) => {
  // Valiidate the rental before updating the database
  const { error } = validate(req.body); 
  
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Find the customer document associated with the ID
  const customer = await Customer.findById(req.body.customerID);
  if(!customer) return res.status(400).send('Invalid customer');
  
  // Find the movie document associated with the ID
  let movie = await Movie.findById(req.body.movieID);
  if(!movie) return res.status(400).send('Invalid movie');

  // Check if the movie is in stock
  if(movie.numberInStock == 0) return res.status(400).send('Movie not in stock');

  // Using update first approach
  const rental = await Rental.findByIdAndUpdate(req.params.id, 
    { customer: {
      _id: customer.id,
      name: customer.name,
      phone: customer.phone,
      },
      movie: {
        _id: movie.id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      }, }, 
    { new: true });

  // Send a 404 error indicate rental not found
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  // Send a response with the rental
  res.send(rental);
});

router.delete('/:id', async (req, res) => {
  // Delete and await the result via a promise
  const rental = await Rental.findByIdAndRemove(req.params.id);

  // Send a 404 error indicate rental not found
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  // Send a response with the rental
  res.send(rental);
});

module.exports = router;