const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateUser, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/user', authenticate, authController.getCurrentUser);
router.put('/user', authenticate, validateUser.updateDisplayName, handleValidationErrors, authController.updateDisplayName);
router.delete('/user', authenticate, authController.deleteUser);

module.exports = router;