const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateStat = {
    getByDateRange: [
      query('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be in ISO format (YYYY-MM-DD)')
        .toDate(),
      
      query('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be in ISO format (YYYY-MM-DD)')
        .toDate(),
      
      query('type')
        .optional()
        .isIn(['daily', 'streak'])
        .withMessage('Type must be either "daily" or "streak"')
    ]
  };

  module.exports = { validateStat };