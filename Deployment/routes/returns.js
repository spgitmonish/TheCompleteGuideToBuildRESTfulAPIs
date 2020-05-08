const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate')
const validateReturn = require('../models/return');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const authenticate = require('../middleware/authenticate');

// CRUD
router.post('/', [authenticate, validate(validateReturn)], async (req, res) => {
  // Check if the rental object exists
  let rental = await Rental.find(
    // Use the dot notation to find a property of a subdocument
    {"customer.name": req.body.customerName},
  );
  rental = rental[0];
  if(!rental) return res.status(404).send('Rental not found');

  // Check if the return is already processed
  if(rental.dateReturned) return res.status(400).send('Rental already processed');

  // Set the return date of the return and the rental fee
  rental.return();
  await rental.save();

  // Increment the number in stock and save the movie
  await Movie.update({ title: req.body.movieTitle },
    { $inc: { numberInStock: 1} }
  );

  res.send(rental);
});

module.exports = router;