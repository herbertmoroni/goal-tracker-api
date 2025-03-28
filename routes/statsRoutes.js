const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateStat, handleValidationErrors } = require('../middleware/validation');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/dashboard', statsController.getDashboardStats);
router.get('/streaks', statsController.getStreaks);
router.get('/scores', validateStat.getByDateRange, handleValidationErrors, statsController.getScores);

module.exports = router;