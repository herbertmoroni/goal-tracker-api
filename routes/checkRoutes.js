/**
 * @swagger
 * /checks/week:
 *   get:
 *     summary: Get all checks for current week
 *     tags: [Checks]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date (YYYY-MM-DD) - defaults to start of current week
 *     responses:
 *       200:
 *         description: Week checks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/WeekChecks'
 *       400:
 *         description: Invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /checks/{goalId}/{date}:
 *   post:
 *     summary: Toggle goal completion for a specific date
 *     tags: [Checks]
 *     parameters:
 *       - name: goalId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *       - name: date
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Check toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Check'
 *                 message:
 *                   type: string
 *                   example: Check toggled successfully
 *       400:
 *         description: Invalid date format or goal ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - goal belongs to another user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Goal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /checks/date/{date}:
 *   get:
 *     summary: Get all checks for a specific date
 *     tags: [Checks]
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Date checks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Check'
 *       400:
 *         description: Invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const express = require('express');
const router = express.Router();


router.use(authenticate);

router.get('/week', checkController.getWeekChecks);
router.post('/:goalId/:date', validateDate, checkController.toggleCheck);
router.get('/date/:date', validateDate, checkController.getChecksByDate);

module.exports = router;