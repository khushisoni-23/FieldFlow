const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: KPI metrics, analytics reports, and dashboard performance data
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/reports/analytics:
 *   get:
 *     summary: Retrieve system analytics and KPI overview
 *     description: Returns aggregated KPIs, job status counts, active technician count, and revenue stats.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytical summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/analytics', reportController.getAnalytics);

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Retrieve dashboard analytics (alias)
 *     description: Alias endpoint for `/api/reports/analytics`.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytical summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', reportController.getAnalytics);

module.exports = router;
