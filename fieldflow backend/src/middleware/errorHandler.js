const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  
  // Log internal server errors
  if (statusCode === 500) {
    console.error('Internal Server Error:', err);
  }

  const response = {
    message: err.message || 'An unexpected error occurred'
  };

  // Stack trace only in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
