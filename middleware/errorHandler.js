const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Add request ID if available
    const requestId = req.id || '';
  
    if (process.env.NODE_ENV === 'development') {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        requestId,
        stack: err.stack
      });
    } else {
      // For production
      if (err.isOperational) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          requestId
        });
      } else {
        console.error('ERROR:', err);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong',
          requestId
        });
      }
    }
  };
  
  module.exports = errorHandler;