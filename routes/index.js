const express = require('express');
const router = express.Router();

// Register routes
router.use('/auth', require('./authRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/goals', require('./goalRoutes'));
router.use('/checks', require('./checkRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/health', require('./healthRoutes'));

module.exports = router;