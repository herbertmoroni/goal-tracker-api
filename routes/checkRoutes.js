const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCheck, handleValidationErrors } = require('../middleware/validation');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/week', validateCheck.getByDateRange, handleValidationErrors, checkController.getWeekChecks);
router.post('/:goalId/:date', validateCheck.toggleCheck, handleValidationErrors, checkController.toggleCheck);
router.get('/date/:date', validateCheck.getByDate, handleValidationErrors, checkController.getChecksByDate);

module.exports = router;