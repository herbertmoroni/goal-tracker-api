const express = require('express');
const router = express.Router();
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: API is operational
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is operational',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');

// Register routes
router.use('/auth', require('./authRoutes'));
router.use('/goals', require('./goalRoutes'));
router.use('/checks', require('./checkRoutes'));
router.use('/stats', require('./statsRoutes'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;