const mongoose = require('mongoose');
const Joi = require('joi');

// Schema representing a movie in the collection
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    require: true,
    default: false
  },
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50
  }
});

// Create model from schema
const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required()
  }

  return Joi.validate(customer, schema);
};

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;