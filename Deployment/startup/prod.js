const helmet = require('helmet');
const compression = require('compression');

// Takes the application as input to install middleware pieces for production
module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
}