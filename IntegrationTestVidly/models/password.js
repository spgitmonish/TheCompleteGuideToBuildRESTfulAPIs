const PasswordComplexity = require('joi-password-complexity');

// Setup the password complexity rules
const complexityOptions = {
  min: 10,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
}

const passwordComplexity = new PasswordComplexity(complexityOptions);

module.exports = passwordComplexity;