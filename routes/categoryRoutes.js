const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCategory, handleValidationErrors } = require('../middleware/validation');

// Apply authentication to all category routes
router.use(authenticate);

router.get('/', categoryController.getAllCategories);
router.post('/', validateCategory.create, handleValidationErrors, categoryController.createCategory);
router.get('/:id', validateCategory.getById, handleValidationErrors, categoryController.getCategoryById);
router.put('/:id', validateCategory.update, handleValidationErrors, categoryController.updateCategory);
router.delete('/:id', validateCategory.getById, handleValidationErrors, categoryController.deleteCategory);

module.exports = router;