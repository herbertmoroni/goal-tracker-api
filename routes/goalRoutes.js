const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateGoal, handleValidationErrors } = require('../middleware/validation');

// Apply authentication to all check routes
router.use(authenticate);

router.get('/', validateGoal.listByUser, handleValidationErrors, goalController.getAllGoals);
router.post('/', validateGoal.create, handleValidationErrors, goalController.createGoal);
router.get('/:id', validateGoal.getById, handleValidationErrors, goalController.getGoalById);
router.put('/:id', validateGoal.update, handleValidationErrors, goalController.updateGoal);
router.delete('/:id', validateGoal.getById, handleValidationErrors, goalController.deleteGoal);
router.patch('/reorder', validateGoal.reorder, handleValidationErrors, goalController.reorderGoals);

module.exports = router;