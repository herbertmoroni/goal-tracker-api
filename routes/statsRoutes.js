const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/dashboard', statsController.getDashboardStats);
router.get('/streaks', statsController.getStreaks);
router.get('/scores',  statsController.getScores);

module.exports = router;