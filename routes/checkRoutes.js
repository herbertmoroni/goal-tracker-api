const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/week', checkController.getWeekChecks);
router.post('/:goalId/:date', checkController.toggleCheck);
router.get('/date/:date', checkController.getChecksByDate);

module.exports = router;