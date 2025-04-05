const { validateGoal } = require('./goalValidation');
const { validateCheck } = require('./checkValidation');
const { validateStat } = require('./statValidation');
const { validateCategory} = require('./categoryValidation');
const { handleValidationErrors } = require('./handleErrors');

module.exports = {
  validateGoal,
  validateCheck, 
  validateStat,
  validateCategory,
  handleValidationErrors
};