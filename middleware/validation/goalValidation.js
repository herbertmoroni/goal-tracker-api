const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateGoal = {
    create: [
      body('name')
        .notEmpty()
        .withMessage('Goal name is required')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Goal name must be between 2 and 50 characters'),

      body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid category ID format'),
      
      body('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string')
        .trim(),
      
      body('positive')
        .optional()
        .isBoolean()
        .withMessage('Positive must be a boolean value'),
      
      body('points')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Points must be between 1 and 5'),
      
      body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
      
      body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean value')
    ],
  
    update: [
      param('id')
        .isMongoId()
        .withMessage('Invalid goal ID format'),
        
      body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid category ID format'),
      
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Goal name must be between 2 and 50 characters'),
      
      body('icon')
        .optional()
        .isString()
        .withMessage('Icon must be a string')
        .trim(),
      
      body('positive')
        .optional()
        .isBoolean()
        .withMessage('Positive must be a boolean value'),
      
      body('points')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Points must be between 1 and 5'),
      
      body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),
      
      body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean value')
    ],
  
    getById: [
      param('id')
        .isMongoId()
        .withMessage('Invalid goal ID format')
    ],
  
    listByUser: [
      query('active')
        .optional()
        .isBoolean()
        .withMessage('Active filter must be a boolean value'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
    ]
  };

  validateGoal.reorder = [
    body('goals')
      .isArray()
      .withMessage('Goals must be an array')
      .custom(goals => {
        if (!goals.every(g => mongoose.Types.ObjectId.isValid(g.id))) {
          throw new Error('Each goal must have a valid ID');
        }
        if (!goals.every(g => Number.isInteger(g.order) && g.order >= 0)) {
          throw new Error('Each goal must have a valid order number');
        }
        return true;
      })
  ];

  module.exports = { validateGoal };