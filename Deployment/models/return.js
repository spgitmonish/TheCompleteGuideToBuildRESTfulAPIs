const Joi = require('joi');

module.exports = function(returns) {
  const schema = {
    customerName: Joi.string().required(),
    movieTitle: Joi.string().required()
  }

  return Joi.validate(returns, schema);
};