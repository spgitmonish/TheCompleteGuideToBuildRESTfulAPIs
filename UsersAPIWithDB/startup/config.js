const config = require('config');

module.exports = function() {
  // Check if the configuration setting is defined 
  if(!config.get('jwtSecretPrivateKey')) {
    throw new Error('FATAL ERROR: jwtSecretPrivateKey is not defined');
  }
};
