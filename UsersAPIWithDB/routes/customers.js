const express = require('express')
const router = express.Router();
const {Customer, validate} = require('../models/customer');
const authenticate = require('../middleware/authenticate');

// CRUD
router.get('/', async (req, res) => {
  // Send back all the genres read from the database
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  // Check if the customer id exists
  const customer = await Customer.findById(req.params.id);

  // Send a 404 error indicate customer not found
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Send a response with the customer
  res.send(customer);
});

router.post('/', authenticate, async (req, res) => {
  // Valiidate the customer
  const { error } = validate(req.body);

  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);

  // Add the customer to the list
  let customer = new Customer({ isGold: req.body.isGold, name: req.body.name, phone: req.body.phone });
  customer = await customer.save();

  // Send a response with the customer
  res.send(customer);
});

router.put('/:id', authenticate, async (req, res) => {
  // Valiidate the customer before updating the database
  const { error } = validate(req.body); 
  // Post 400 as the error code and the error message
  if (error) return res.status(400).send(error.details[0].message);
  
  // Using update first approach
  const customer = await Customer.findByIdAndUpdate(req.params.id, { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone }, { new: true });

  // Send a 404 error indicate customer not found
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Send a response with the customer
  res.send(customer);
});

router.delete('/:id', authenticate, async (req, res) => {
  // Delete and await the result via a promise
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // Send a 404 error indicate customer not found
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Send a response with the customer
  res.send(customer);
});

module.exports = router;