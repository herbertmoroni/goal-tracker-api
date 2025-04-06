const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateCheck = {
    create: [
      body('goal')
        .notEmpty()
        .withMessage('Goal ID is required')
        .isMongoId()
        .withMessage('Invalid goal ID format'),
      
      body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be in ISO format (YYYY-MM-DD)')
        .toDate(),
      
      body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
    ],
  
    update: [
      param('id')
        .isMongoId()
        .withMessage('Invalid check ID format'),
      
      body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
    ],
  
    getByDate: [
      param('date')
        .isISO8601()
        .withMessage('Date must be in ISO format (YYYY-MM-DD)')
        .toDate(),
      
      query('goalId')
        .optional()
        .isMongoId()
        .withMessage('Invalid goal ID format')
    ],

    delete: [
      param('id')
        .isMongoId()
        .withMessage('Invalid check ID format')
    ]
  };

  validateCheck.toggleCheck = [
    param('goalId').isMongoId().withMessage('Invalid goal ID format'),
    param('date').isISO8601().withMessage('Invalid date format').toDate(),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
  ];

  module.exports = { validateCheck} ;