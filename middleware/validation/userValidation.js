const { body } = require('express-validator');

const validateUser = {
  updateDisplayName: [
    body('displayName')
      .notEmpty()
      .withMessage('Display name is required')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Display name must be between 2 and 50 characters')
  ]
};

module.exports = { validateUser };