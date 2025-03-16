const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/dashboard', statsController.getDashboardStats);
router.get('/streaks', statsController.getStreaks);
router.get('/scores',  statsController.getScores);

module.exports = router;