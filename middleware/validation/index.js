const { validateGoal } = require('./goalValidation');
const { validateCheck } = require('./checkValidation');
const { validateStat } = require('./statValidation');
const { handleValidationErrors } = require('./handleErrors');

module.exports = {
  validateGoal,
  validateCheck, 
  validateStat,
  handleValidationErrors
};