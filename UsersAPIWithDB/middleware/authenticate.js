const jwt = require('jsonwebtoken');
const config = require('config');

// Checks if the token is valid, this is meant to be used a middleware function in the route handlers
function authenticate(req, res, next) {
  // Access the token the user sent from the header
  const token = req.header('x-auth-token');
  if(!token) return res.status(401).send('Access denied. No token provided');

  // Compare the token based on the secret key which was set in the environment variable
  try {
    const decoded = jwt.verify(token, config.get('jwtSecretPrivateKey'));
    req.user = decoded; // Only the id is the property which was used when generating the JWT
    // Pass control to the next function in the request processing pipeline i.e. the route handler
    next();
  } catch(ex) {
    res.status(400).send('Invalid token');
  }
}

module.exports = authenticate;