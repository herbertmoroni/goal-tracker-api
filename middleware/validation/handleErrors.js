const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        value: err.value,
        message: err.msg,
        location: err.location
      }))
    });
  }
  next();
};

module.exports = { handleValidationErrors } ;