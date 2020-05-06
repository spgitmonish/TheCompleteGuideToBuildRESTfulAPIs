// Middleware to check if the user is admin or not
function admin(req, res, next) {
  if(!req.user.isAdmin) return res.status(403).send('Access denied');
  next();
}

module.exports = admin;