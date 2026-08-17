function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Malformed JSON sent to express.json().
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Request body contains invalid JSON'
    });
  }

  // Mongoose validation failures.
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Validation failed',
      details: Object.values(err.errors).map((item) => item.message)
    });
  }

  // Invalid MongoDB ObjectId.
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid task ID'
    });
  }

  const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  return res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : (err.name || 'Error'),
    message:
      status === 500
        ? 'An unexpected server error occurred'
        : err.message
  });
}

module.exports = { notFoundHandler, errorHandler };
