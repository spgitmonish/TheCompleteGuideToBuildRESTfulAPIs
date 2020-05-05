const mongoose = require('mongoose');
const Joi = require('joi');

// Schema representing a rental in the collection
const rentalSchema = new mongoose.Schema({
  customer: {
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
  },
  movie: {
    title: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20
    },
    dailyRentalRate: {
      type: Number,
      require: true,
      min: 0,
      max: 255
    }
  },
  dateRented: {
    type: Date,
    require: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

// Create model from schema
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  // This is validating the input
  const schema = {
    customerID: Joi.string().required(),
    movieID: Joi.string().required()
  }

  // Validate the rental
  return Joi.validate(rental, schema);
};

module.exports.Rental = Rental;
module.exports.validate = validateRental;