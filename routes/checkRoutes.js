const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');

router.get('/week', checkController.getWeekChecks);
router.post('/:goalId/:date', checkController.toggleCheck);
router.get('/date/:date', checkController.getChecksByDate);

module.exports = router;