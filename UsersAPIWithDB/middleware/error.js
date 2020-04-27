module.exports = function(err, req, res, next) {
  // Log the exception
  console.log("Exception");
  res.status(500).send('Something went wrong');
}