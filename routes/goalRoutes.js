const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/', goalController.getAllGoals);
router.post('/',  goalController.createGoal);
router.get('/:id', goalController.getGoalById);
router.put('/:id',  goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.patch('/reorder',  goalController.reorderGoals);

module.exports = router;