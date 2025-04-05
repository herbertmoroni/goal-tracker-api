const { body, param } = require('express-validator');

const validateCategory = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Category name is required')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Category name must be between 2 and 30 characters'),
    
    body('color')
      .optional()
      .isString()
      .withMessage('Color must be a string')
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('Color must be a valid hex color code'),   
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid category ID format'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Category name must be between 2 and 30 characters'),
    
    body('color')
      .optional()
      .isString()
      .withMessage('Color must be a string')
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('Color must be a valid hex color code'),
       
    body('order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Order must be a non-negative integer')
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid category ID format')
  ]
};

module.exports = { validateCategory };