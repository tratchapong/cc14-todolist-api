module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  res.status(statusCode).json({err: err.message})
}
